
import { auth } from "../config/firebase.js";
import { userCacheUtils } from "../utils/userCache.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const commentsController = (pool, getOrCreateMovie) => {
  const userCache = userCacheUtils(pool);

  return {
    addComment: asyncHandler(async (req, res) => {
      const { tmdb_id, comment_text, parent_comment_id } = req.body;
      const user_id = req.user.user_id;

      if (!tmdb_id || !Number.isInteger(tmdb_id)) {
        throw new ApiError(400, "Invalid or missing tmdb_id");
      }
      if (!comment_text || comment_text.trim() === "") {
        throw new ApiError(400, "Comment text is required");
      }
      if (parent_comment_id && !Number.isInteger(parent_comment_id)) {
        throw new ApiError(400, "Invalid parent_comment_id");
      }

      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        const movie = await getOrCreateMovie(tmdb_id, client);

        if (parent_comment_id) {
          const parentCheck = await client.query(
            "SELECT 1 FROM comments WHERE comment_id = $1 AND movie_id = $2",
            [parent_comment_id, movie.movie_id]
          );
          if (parentCheck.rowCount === 0) {
            throw new ApiError(400, "Parent comment not found in this movie thread");
          }
        }

        const insertQuery = `
          INSERT INTO comments (user_id, movie_id, parent_comment_id, comment_text, created_at, updated_at)
          VALUES ($1, $2, $3, $4, NOW(), NOW())
          RETURNING comment_id, created_at, updated_at;
        `;
        const values = [user_id, movie.movie_id, parent_comment_id, comment_text.trim()];
        const result = await client.query(insertQuery, values);

        await client.query("COMMIT");
        res.status(201).json(new ApiResponse(201, result.rows[0], "Comment added successfully"));

      } catch (error) {
        await client.query("ROLLBACK");
        throw new ApiError(500, `Failed to add comment: ${error.message}`);
      } finally {
        client.release();
      }
    }),

    getComments: asyncHandler(async (req, res) => {
      const { tmdb_id } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      if (!tmdb_id || !Number.isInteger(parseInt(tmdb_id))) {
        throw new ApiError(400, "Invalid tmdb_id");
      }

      const movie = await getOrCreateMovie(parseInt(tmdb_id));

      const countQuery = `SELECT COUNT(*) as total FROM comments WHERE movie_id = $1 AND parent_comment_id IS NULL`;
      const countResult = await pool.query(countQuery, [movie.movie_id]);
      const totalRootComments = parseInt(countResult.rows[0].total);

      const rootCommentsQuery = `
        SELECT comment_id FROM comments 
        WHERE movie_id = $1 AND parent_comment_id IS NULL
        ORDER BY created_at DESC LIMIT $2 OFFSET $3`;
      const rootCommentsResult = await pool.query(rootCommentsQuery, [movie.movie_id, limit, offset]);
      const rootCommentIds = rootCommentsResult.rows.map((r) => r.comment_id);

      let comments = [];
      if (rootCommentIds.length > 0) {
        const commentsQuery = `
          WITH RECURSIVE comment_tree AS (
            SELECT c.*, u.firebase_uid, 0 as depth, c.created_at as root_created_at
            FROM comments c JOIN users u ON c.user_id = u.user_id
            WHERE c.comment_id = ANY($1::int[])
            UNION ALL
            SELECT c.*, u.firebase_uid, ct.depth + 1, ct.root_created_at
            FROM comments c JOIN users u ON c.user_id = u.user_id
            INNER JOIN comment_tree ct ON c.parent_comment_id = ct.comment_id
            WHERE ct.depth < 10
          )
          SELECT * FROM comment_tree ORDER BY root_created_at DESC, created_at ASC`;
        const commentsResult = await pool.query(commentsQuery, [rootCommentIds]);
        comments = commentsResult.rows;
      }

      const firebaseUids = [...new Set(comments.map((c) => c.firebase_uid))].filter(Boolean);
      let usersMap = {};
      if (firebaseUids.length > 0) {
        try {
          usersMap = await userCache.getUsers(firebaseUids);
        } catch (cacheError) {
          console.error("Cache failed, falling back to Firebase Auth", cacheError);
          try {
            const userRecords = await auth.getUsers(firebaseUids.map((uid) => ({ uid })));
            userRecords.users.forEach((user) => {
              usersMap[user.uid] = { displayName: user.displayName || user.email, photoURL: user.photoURL, email: user.email };
            });
          } catch (authError) {
            console.error("Firebase Auth lookup failed", authError);
            firebaseUids.forEach(uid => { usersMap[uid] = { displayName: "User", photoURL: null, email: null }; });
          }
        }
      }

      const buildCommentTree = (parentId = null) => {
        return comments
          .filter((c) => c.parent_comment_id === parentId)
          .map((comment) => ({
            comment_id: comment.comment_id,
            user_id: comment.firebase_uid || comment.user_id,
            user: usersMap[comment.firebase_uid] || { displayName: "Unknown User", photoURL: null, email: null },
            comment_text: comment.comment_text,
            created_at: comment.created_at,
            updated_at: comment.updated_at,
            replies: buildCommentTree(comment.comment_id),
          }));
      };

      const nestedComments = buildCommentTree();
      const totalPages = Math.ceil(totalRootComments / limit);

      const responsePayload = {
        comments: nestedComments,
        pagination: {
          currentPage: page,
          totalPages,
          totalRootComments,
          limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };

      res.status(200).json(new ApiResponse(200, responsePayload, "Comments fetched successfully"));
    }),

    updateComment: asyncHandler(async (req, res) => {
      const { commentId } = req.params;
      const { comment_text } = req.body;
      const user_id = req.user.user_id;

      if (!commentId || !Number.isInteger(parseInt(commentId))) {
        throw new ApiError(400, "Invalid comment_id");
      }
      if (!comment_text || comment_text.trim() === "") {
        throw new ApiError(400, "Comment text is required");
      }

      const query = `
        UPDATE comments SET comment_text = $1, updated_at = NOW()
        WHERE comment_id = $2 AND user_id = $3
        RETURNING comment_id, comment_text, updated_at;
      `;
      const values = [comment_text.trim(), parseInt(commentId), user_id];
      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        throw new ApiError(404, "Comment not found or you don't have permission to edit it");
      }

      res.status(200).json(new ApiResponse(200, result.rows[0], "Comment updated successfully"));
    }),

    deleteComment: asyncHandler(async (req, res) => {
      const { commentId } = req.params;
      const user_id = req.user.user_id;

      if (!commentId || !Number.isInteger(parseInt(commentId))) {
        throw new ApiError(400, "Invalid comment_id");
      }

      const query = `DELETE FROM comments WHERE comment_id = $1 AND user_id = $2 RETURNING comment_id;`;
      const values = [parseInt(commentId), user_id];
      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        throw new ApiError(404, "Comment not found or you don't have permission to delete it");
      }

      res.status(200).json(new ApiResponse(200, {}, "Comment deleted successfully"));
    }),
  };
};

export default commentsController;

import { auth } from "../config/firebase.js";
import { userCacheUtils } from "../utils/userCache.js";

const commentsController = (pool, getOrCreateMovie) => {
  const userCache = userCacheUtils(pool);

  return {
    addComment: async (req, res) => {
      const { tmdb_id, comment_text, parent_comment_id } = req.body;

      if (!tmdb_id || !Number.isInteger(tmdb_id)) {
        return res.status(400).json({ error: "Invalid or missing tmdb_id" });
      }

      if (!comment_text || comment_text.trim() === "") {
        return res.status(400).json({ error: "Comment text is required" });
      }

      if (parent_comment_id && !Number.isInteger(parent_comment_id)) {
        return res.status(400).json({ error: "Invalid parent_comment_id" });
      }

      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        const movie = await getOrCreateMovie(tmdb_id, client);
        const movie_id = movie.movie_id;

        if (parent_comment_id) {
          const parentCheck = await client.query(
            "SELECT 1 FROM comments WHERE comment_id = $1 AND movie_id = $2",
            [parent_comment_id, movie_id]
          );
          if (parentCheck.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({ error: "Parent comment not found" });
          }
        }

        const insertQuery = `
          INSERT INTO comments (user_id, movie_id, parent_comment_id, comment_text, created_at, updated_at)
          VALUES ($1, $2, $3, $4, NOW(), NOW())
          RETURNING comment_id, created_at, updated_at;
        `;
        // Store the firebase_uid for new comments
        const values = [
          req.user.firebase_uid,
          movie_id,
          parent_comment_id,
          comment_text,
        ];
        const result = await client.query(insertQuery, values);

        await client.query("COMMIT");
        res.status(201).json({
          message: "Comment added successfully",
          comment: result.rows[0],
        });
      } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error adding comment:", error.message, error.stack);
        res.status(500).json({
          error: "Failed to add comment",
          details: error.message,
        });
      } finally {
        client.release();
      }
    },

    getComments: async (req, res) => {
      const { tmdb_id } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      if (!tmdb_id || !Number.isInteger(parseInt(tmdb_id))) {
        return res.status(400).json({ error: "Invalid tmdb_id" });
      }

      try {
        // Get or create movie to ensure it exists
        const movie = await getOrCreateMovie(parseInt(tmdb_id));
        const movie_id = movie.movie_id;

        // Get total count of root comments
        const countQuery = `
          SELECT COUNT(*) as total
          FROM comments 
          WHERE movie_id = $1 AND parent_comment_id IS NULL
        `;
        const countResult = await pool.query(countQuery, [movie_id]);
        const totalRootComments = parseInt(countResult.rows[0].total);

        // First get the root comment IDs with pagination
        const rootCommentsQuery = `
          SELECT comment_id
          FROM comments 
          WHERE movie_id = $1 AND parent_comment_id IS NULL
          ORDER BY created_at DESC
          LIMIT $2 OFFSET $3
        `;
        const rootCommentsResult = await pool.query(rootCommentsQuery, [
          movie_id,
          limit,
          offset,
        ]);
        const rootCommentIds = rootCommentsResult.rows.map((r) => r.comment_id);

        if (rootCommentIds.length === 0) {
          return res.json({
            comments: [],
            pagination: {
              currentPage: page,
              totalPages: Math.ceil(totalRootComments / limit),
              totalRootComments,
              limit,
              hasNextPage: false,
              hasPreviousPage: page > 1,
            },
          });
        }

        // Now fetch all comments with user data joined
        const commentsQuery = `
          WITH RECURSIVE comment_tree AS (
            -- Base case: selected root comments
            SELECT 
              c.comment_id,
              c.user_id,
              u.firebase_uid,
              c.movie_id,
              c.parent_comment_id,
              c.comment_text,
              c.created_at,
              c.updated_at,
              0 as depth,
              c.created_at as root_created_at
            FROM comments c
            LEFT JOIN users u ON (
              CASE 
                WHEN c.user_id::text ~ '^[0-9]+$' THEN u.user_id = c.user_id::integer
                ELSE u.firebase_uid = c.user_id::text
              END
            )
            WHERE c.comment_id = ANY($1::int[])
            
            UNION ALL
            
            -- Recursive case: replies to comments
            SELECT 
              c.comment_id,
              c.user_id,
              u.firebase_uid,
              c.movie_id,
              c.parent_comment_id,
              c.comment_text,
              c.created_at,
              c.updated_at,
              ct.depth + 1,
              ct.root_created_at
            FROM comments c
            LEFT JOIN users u ON (
              CASE 
                WHEN c.user_id::text ~ '^[0-9]+$' THEN u.user_id = c.user_id::integer
                ELSE u.firebase_uid = c.user_id::text
              END
            )
            INNER JOIN comment_tree ct ON c.parent_comment_id = ct.comment_id
            WHERE ct.depth < 10
          )
          SELECT * FROM comment_tree
          ORDER BY root_created_at DESC, created_at ASC
        `;

        const commentsResult = await pool.query(commentsQuery, [
          rootCommentIds,
        ]);
        const comments = commentsResult.rows;

        // Get Firebase UIDs for user lookup
        const firebaseUids = [
          ...new Set(comments.map((c) => c.firebase_uid)),
        ].filter((uid) => uid != null && uid !== "");

        // Fetch user data using cache with Firebase fallback
        let usersMap = {};
        if (firebaseUids.length > 0) {
          try {
            usersMap = await userCache.getUsers(firebaseUids);

            // If cache is empty, fallback to direct Firebase
            const hasValidUsers = Object.keys(usersMap).some(
              (key) =>
                usersMap[key]?.displayName &&
                usersMap[key].displayName !== "User"
            );

            if (!hasValidUsers) {
              const userRecords = await auth.getUsers(
                firebaseUids.map((id) => ({ uid: id }))
              );

              userRecords.users.forEach((user) => {
                usersMap[user.uid] = {
                  displayName:
                    user.displayName || user.email || "Anonymous User",
                  photoURL: user.photoURL,
                  email: user.email,
                };
              });
            }
          } catch (error) {
            console.error("Error fetching users:", error);
            // Create fallback user data
            firebaseUids.forEach((id) => {
              usersMap[id] = {
                displayName: "User",
                photoURL: null,
                email: null,
              };
            });
          }
        }

        // Build nested comment structure
        const buildCommentTree = (parentId = null) => {
          return comments
            .filter((c) => c.parent_comment_id === parentId)
            .map((comment) => ({
              comment_id: comment.comment_id,
              user_id: comment.firebase_uid || comment.user_id,
              user: usersMap[comment.firebase_uid] || {
                displayName: "Unknown User",
                photoURL: null,
                email: null,
              },
              comment_text: comment.comment_text,
              created_at: comment.created_at,
              updated_at: comment.updated_at,
              replies: buildCommentTree(comment.comment_id),
            }));
        };

        const nestedComments = buildCommentTree();
        const totalPages = Math.ceil(totalRootComments / limit);

        res.json({
          comments: nestedComments,
          pagination: {
            currentPage: page,
            totalPages,
            totalRootComments,
            limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
        });
      } catch (error) {
        console.error("Error fetching comments:", error.message, error.stack);
        res.status(500).json({
          error: "Failed to fetch comments",
          details: error.message,
        });
      }
    },

    updateComment: async (req, res) => {
      const { comment_id } = req.params;
      const { comment_text } = req.body;

      if (!comment_id || !Number.isInteger(parseInt(comment_id))) {
        return res.status(400).json({ error: "Invalid comment_id" });
      }

      if (!comment_text || comment_text.trim() === "") {
        return res.status(400).json({ error: "Comment text is required" });
      }

      try {
        const query = `
          UPDATE comments 
          SET comment_text = $1, updated_at = NOW()
          WHERE comment_id = $2 AND user_id = $3
          RETURNING comment_id, comment_text, updated_at;
        `;
        const values = [
          comment_text,
          parseInt(comment_id),
          req.user.firebase_uid,
        ];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
          return res.status(404).json({
            error: "Comment not found or you don't have permission to edit it",
          });
        }

        res.json({
          message: "Comment updated successfully",
          comment: result.rows[0],
        });
      } catch (error) {
        console.error("Error updating comment:", error.message, error.stack);
        res.status(500).json({
          error: "Failed to update comment",
          details: error.message,
        });
      }
    },

    deleteComment: async (req, res) => {
      const { comment_id } = req.params;

      if (!comment_id || !Number.isInteger(parseInt(comment_id))) {
        return res.status(400).json({ error: "Invalid comment_id" });
      }

      try {
        const query = `
          DELETE FROM comments 
          WHERE comment_id = $1 AND user_id = $2
          RETURNING comment_id;
        `;
        const values = [parseInt(comment_id), req.user.firebase_uid];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
          return res.status(404).json({
            error:
              "Comment not found or you don't have permission to delete it",
          });
        }

        res.json({ message: "Comment deleted successfully" });
      } catch (error) {
        console.error("Error deleting comment:", error.message, error.stack);
        res.status(500).json({
          error: "Failed to delete comment",
          details: error.message,
        });
      }
    },
  };
};

export default commentsController;

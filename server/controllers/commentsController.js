import { auth } from "../config/firebase.js";

const commentsController = (pool, getOrCreateMovie) => ({
  addComment: async (req, res) => {
    const { tmdb_id, comment_text, parent_comment_id } = req.body;
    const user_id = req.user.user_id;

    if (!tmdb_id || !Number.isInteger(tmdb_id)) {
      return res.status(400).json({ error: "Invalid or missing tmdb_id" });
    }

    if (!comment_text || comment_text.trim() === "") {
      return res.status(400).json({ error: "Comment text cannot be empty" });
    }

    if (parent_comment_id && !Number.isInteger(parent_comment_id)) {
      return res.status(400).json({ error: "Invalid parent_comment_id" });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const movie = await getOrCreateMovie(tmdb_id, client);
      const movie_id = movie.movie_id;

      // If parent_comment_id is provided, verify it exists and belongs to the same movie
      if (parent_comment_id) {
        const parentQuery = `
          SELECT comment_id FROM comments
          WHERE comment_id = $1 AND movie_id = $2;
        `;
        const parentResult = await client.query(parentQuery, [
          parent_comment_id,
          movie_id,
        ]);
        if (parentResult.rows.length === 0) {
          return res.status(400).json({ error: "Invalid parent comment" });
        }
      }

      const insertQuery = `
        INSERT INTO comments (user_id, movie_id, parent_comment_id, comment_text, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING comment_id, created_at;
      `;
      const values = [
        user_id,
        movie_id,
        parent_comment_id || null,
        comment_text.trim(),
      ];
      const result = await client.query(insertQuery, values);

      await client.query("COMMIT");
      res.status(201).json({
        message: "Comment added",
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
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    if (!tmdb_id || !Number.isInteger(parseInt(tmdb_id))) {
      return res.status(400).json({ error: "Invalid TMDB ID" });
    }

    const client = await pool.connect();
    try {
      const movie = await getOrCreateMovie(parseInt(tmdb_id), client);
      const movieId = movie.movie_id;

      // Get total count of root comments for pagination
      const totalResult = await client.query(
        "SELECT COUNT(*) FROM comments WHERE movie_id = $1 AND parent_comment_id IS NULL",
        [movieId]
      );
      const totalRootComments = parseInt(totalResult.rows[0].count, 10);
      const totalPages = Math.ceil(totalRootComments / limit);

      // Get paginated root comments
      const rootCommentsResult = await client.query(
        `SELECT comment_id FROM comments WHERE movie_id = $1 AND parent_comment_id IS NULL ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [movieId, limit, offset]
      );
      const rootCommentIds = rootCommentsResult.rows.map((r) => r.comment_id);

      if (rootCommentIds.length === 0) {
        return res.json({
          comments: [],
          pagination: {
            totalRootComments,
            totalPages: totalPages,
            currentPage: page,
            limit,
          },
        });
      }

      // Fetch all comments (root and replies) for the movie to build the tree
      const allCommentsQuery = `
        WITH RECURSIVE comment_tree AS (
          SELECT
            c.comment_id, c.user_id, c.parent_comment_id, c.comment_text, c.created_at, c.updated_at
          FROM comments c
          WHERE c.comment_id = ANY($1::int[])

          UNION ALL

          SELECT
            c.comment_id, c.user_id, c.parent_comment_id, c.comment_text, c.created_at, c.updated_at
          FROM comments c
          JOIN comment_tree ct ON c.parent_comment_id = ct.comment_id
        )
        SELECT * FROM comment_tree ORDER BY created_at ASC;
      `;
      const allCommentsResult = await client.query(allCommentsQuery, [
        rootCommentIds,
      ]);

      const commentsFromDb = allCommentsResult.rows;
      const userIds = [
        ...new Set(
          commentsFromDb
            .map((c) => c.user_id)
            .filter((id) => id && typeof id === "string")
        ),
      ];

      let usersMap = {};
      if (userIds.length > 0) {
        // Fetch user data from Firebase
        const userRecords = await auth.getUsers(
          userIds.map((id) => ({ uid: id }))
        );

        usersMap = userRecords.users.reduce((acc, user) => {
          acc[user.uid] = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
          };
          return acc;
        }, {});
      }

      const commentsWithUsers = commentsFromDb.map((comment) => ({
        ...comment,
        user: usersMap[comment.user_id] || { displayName: "Unknown User" },
      }));

      const commentsMap = {};
      commentsWithUsers.forEach((comment) => {
        commentsMap[comment.comment_id] = { ...comment, replies: [] };
      });

      const rootComments = [];
      commentsWithUsers.forEach((comment) => {
        if (comment.parent_comment_id) {
          if (commentsMap[comment.parent_comment_id]) {
            commentsMap[comment.parent_comment_id].replies.push(
              commentsMap[comment.comment_id]
            );
          }
        } else {
          // Only add to root if it's one of the paginated root comments
          if (rootCommentIds.includes(comment.comment_id)) {
            rootComments.push(commentsMap[comment.comment_id]);
          }
        }
      });
      // Sort root comments by creation date descending as per pagination
      rootComments.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      res.json({
        comments: rootComments,
        pagination: {
          totalRootComments,
          totalPages,
          currentPage: page,
          limit,
        },
      });
    } catch (error) {
      console.error("Error fetching comments:", error.message, error.stack);
      res.status(500).json({
        error: "Failed to fetch comments",
        details: error.message,
      });
    } finally {
      client.release();
    }
  },

  updateComment: async (req, res) => {
    const { commentId } = req.params;
    const { comment_text } = req.body;
    const user_id = req.user.user_id;

    if (!commentId || !Number.isInteger(parseInt(commentId))) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    if (!comment_text || comment_text.trim() === "") {
      return res.status(400).json({ error: "Comment text cannot be empty" });
    }

    try {
      const updateQuery = `
        UPDATE comments
        SET comment_text = $1, updated_at = NOW()
        WHERE comment_id = $2 AND user_id = $3
        RETURNING comment_id, updated_at;
      `;
      const result = await pool.query(updateQuery, [
        comment_text.trim(),
        parseInt(commentId),
        user_id,
      ]);

      if (result.rows.length > 0) {
        res.json({
          message: "Comment updated",
          comment: result.rows[0],
        });
      } else {
        res
          .status(404)
          .json({ error: "Comment not found or not owned by user" });
      }
    } catch (error) {
      console.error("Error updating comment:", error.message, error.stack);
      res.status(500).json({
        error: "Failed to update comment",
        details: error.message,
      });
    }
  },

  deleteComment: async (req, res) => {
    const { commentId } = req.params;
    const user_id = req.user.user_id;

    if (!commentId || !Number.isInteger(parseInt(commentId))) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    try {
      const deleteQuery = `
        DELETE FROM comments
        WHERE comment_id = $1 AND user_id = $2
        RETURNING comment_id;
      `;
      const result = await pool.query(deleteQuery, [
        parseInt(commentId),
        user_id,
      ]);

      if (result.rows.length > 0) {
        res.json({ message: "Comment deleted" });
      } else {
        res
          .status(404)
          .json({ error: "Comment not found or not owned by user" });
      }
    } catch (error) {
      console.error("Error deleting comment:", error.message, error.stack);
      res.status(500).json({
        error: "Failed to delete comment",
        details: error.message,
      });
    }
  },
});

export default commentsController;

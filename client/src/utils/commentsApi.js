import { fetchData } from "./fetchData";

export const commentsApi = {
  // Add a new comment
  addComment: async (tmdb_id, comment_text, parent_comment_id = null) => {
    return await fetchData(
      `${import.meta.env.VITE_BASE_API_URL}api/user/comments`,
      {
        method: "POST",
        body: { tmdb_id, comment_text, parent_comment_id },
      }
    );
  },

  // Get comments for a movie with pagination
  getComments: async (tmdb_id, page = 1, limit = 10) => {
    return await fetchData(
      `${
        import.meta.env.VITE_BASE_API_URL
      }api/user/comments/${tmdb_id}?page=${page}&limit=${limit}`
    );
  },

  // Update a comment
  updateComment: async (commentId, comment_text) => {
    return await fetchData(
      `${import.meta.env.VITE_BASE_API_URL}api/user/comments/${commentId}`,
      {
        method: "PUT",
        body: { comment_text },
      }
    );
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    return await fetchData(
      `${import.meta.env.VITE_BASE_API_URL}api/user/comments/${commentId}`,
      {
        method: "DELETE",
      }
    );
  },
};

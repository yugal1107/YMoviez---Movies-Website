import { fetchData } from "./fetchData";

export const commentsApi = {
  // Add a new comment
  addComment: async (tmdb_id, comment_text, parent_comment_id = null) => {
    const response = await fetchData(
      `${import.meta.env.VITE_BASE_API_URL}api/comments`,
      {
        method: "POST",
        body: { tmdb_id, comment_text, parent_comment_id },
      }
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || "Failed to add comment");
  },

  // Get comments for a movie with pagination
  getComments: async (tmdb_id, page = 1, limit = 10) => {
    const response = await fetchData(
      `${
        import.meta.env.VITE_BASE_API_URL
      }api/comments/${tmdb_id}?page=${page}&limit=${limit}`
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || "Failed to get comments");
  },

  // Update a comment
  updateComment: async (commentId, comment_text) => {
    const response = await fetchData(
      `${import.meta.env.VITE_BASE_API_URL}api/comments/${commentId}`,
      {
        method: "PUT",
        body: { comment_text },
      }
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || "Failed to update comment");
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    const response = await fetchData(
      `${import.meta.env.VITE_BASE_API_URL}api/comments/${commentId}`,
      {
        method: "DELETE",
      }
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || "Failed to delete comment");
  },
};

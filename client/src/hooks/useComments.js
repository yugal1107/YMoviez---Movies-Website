import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../utils/commentsApi";
import { toast } from "react-hot-toast";

export const useComments = (tmdb_id, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["comments", tmdb_id, page, limit],
    queryFn: () => commentsApi.getComments(tmdb_id, page, limit),
    enabled: !!tmdb_id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tmdb_id, comment_text, parent_comment_id }) =>
      commentsApi.addComment(tmdb_id, comment_text, parent_comment_id),
    onSuccess: (data, variables) => {
      toast.success("Comment added successfully!");
      // Invalidate and refetch comments for the movie
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.tmdb_id],
      });
    },
    onError: (error) => {
      toast.error("Failed to add comment. Please try again.");
      console.error("Error adding comment:", error);
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, comment_text }) =>
      commentsApi.updateComment(commentId, comment_text),
    onSuccess: (data, variables) => {
      toast.success("Comment updated successfully!");
      // Invalidate comments queries (you might need to refetch specific movie comments)
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      toast.error("Failed to update comment. Please try again.");
      console.error("Error updating comment:", error);
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => commentsApi.deleteComment(commentId),
    onSuccess: (data, variables) => {
      toast.success("Comment deleted successfully!");
      // Invalidate comments queries
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      toast.error("Failed to delete comment. Please try again.");
      console.error("Error deleting comment:", error);
    },
  });
};

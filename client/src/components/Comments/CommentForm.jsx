import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useAddComment } from "../../hooks/useComments";
import { Loader2, Send } from "lucide-react";

const CommentForm = ({
  tmdbId,
  parentCommentId = null,
  onCancel,
  placeholder = "Write a comment...",
}) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const addCommentMutation = useAddComment();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      addCommentMutation.mutate(
        {
          tmdb_id: tmdbId,
          comment_text: commentText.trim(),
          parent_comment_id: parentCommentId,
        },
        {
          onSuccess: () => {
            setCommentText("");
            if (onCancel) onCancel();
          },
        }
      );
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-center">
        <p className="text-gray-400">Please log in to write a comment.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 resize-none"
        rows={parentCommentId ? 3 : 4}
        disabled={addCommentMutation.isPending}
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!commentText.trim() || addCommentMutation.isPending}
          className="px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white flex items-center gap-2 transition-colors"
        >
          {addCommentMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {parentCommentId ? "Reply" : "Comment"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;

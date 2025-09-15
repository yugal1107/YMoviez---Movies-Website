import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useUpdateComment, useDeleteComment } from "../../hooks/useComments";
import {
  MessageSquare,
  Edit2,
  Trash2,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import CommentForm from "./CommentForm";

const CommentItem = ({ comment, tmdbId, depth = 0 }) => {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [editText, setEditText] = useState(comment.comment_text);

  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();

  const isOwner = user && user.uid === comment.user_id;
  const maxDepth = 3; // Limit reply depth

  const handleEdit = () => {
    if (editText.trim()) {
      updateCommentMutation.mutate(
        {
          commentId: comment.comment_id,
          comment_text: editText.trim(),
        },
        {
          onSuccess: () => {
            setShowEditForm(false);
            setShowActions(false);
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(comment.comment_id, {
        onSuccess: () => {
          setShowActions(false);
        },
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`${depth > 0 ? "ml-6 border-l border-gray-700 pl-4" : ""}`}>
      <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
        {/* Comment Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {comment.user?.displayName?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <p className="font-medium text-white">
                {comment.user?.displayName || "Unknown User"}
              </p>
              <p className="text-xs text-gray-400">
                {formatDate(comment.created_at)}
                {comment.updated_at !== comment.created_at && " (edited)"}
              </p>
            </div>
          </div>

          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 rounded hover:bg-gray-700 transition-colors"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </button>

              {showActions && (
                <div className="absolute right-0 top-8 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10 min-w-[120px]">
                  <button
                    onClick={() => {
                      setShowEditForm(true);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-800 flex items-center gap-2 text-sm"
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteCommentMutation.isPending}
                    className="w-full px-3 py-2 text-left hover:bg-gray-800 flex items-center gap-2 text-sm text-red-400"
                  >
                    {deleteCommentMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comment Content */}
        {showEditForm ? (
          <div className="space-y-3">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white resize-none"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditForm(false)}
                className="px-3 py-1 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={!editText.trim() || updateCommentMutation.isPending}
                className="px-3 py-1 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-600 rounded text-white transition-colors"
              >
                {updateCommentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-200 whitespace-pre-wrap">
            {comment.comment_text}
          </p>
        )}

        {/* Comment Actions */}
        {!showEditForm && (
          <div className="flex items-center gap-4 pt-2">
            {depth < maxDepth && user && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-pink-500 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Reply
              </button>
            )}
            {comment.replies?.length > 0 && (
              <span className="text-xs text-gray-500">
                {comment.replies.length} repl
                {comment.replies.length === 1 ? "y" : "ies"}
              </span>
            )}
          </div>
        )}

        {/* Reply Form */}
        {showReplyForm && (
          <div className="pt-3">
            <CommentForm
              tmdbId={tmdbId}
              parentCommentId={comment.comment_id}
              onCancel={() => setShowReplyForm(false)}
              placeholder="Write a reply..."
            />
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.comment_id}
              comment={reply}
              tmdbId={tmdbId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;

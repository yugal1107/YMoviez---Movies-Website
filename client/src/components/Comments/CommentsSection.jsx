import React, { useState } from "react";
import { useComments } from "../../hooks/useComments";
import {
  MessageSquare,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

const CommentsSection = ({ tmdbId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  const {
    data: commentsData,
    isLoading,
    error,
  } = useComments(tmdbId, currentPage, commentsPerPage);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Comments
        </h2>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          <span className="ml-2 text-gray-400">Loading comments...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Comments
        </h2>
        <div className="bg-gray-900/50 rounded-lg p-6 text-center">
          <p className="text-red-400">
            Failed to load comments. Please try again.
          </p>
        </div>
      </section>
    );
  }

  const { comments = [], pagination } = commentsData || {};
  const { totalPages = 1, currentPage: serverCurrentPage = 1 } =
    pagination || {};

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Comments
          {pagination?.totalRootComments > 0 && (
            <span className="text-lg text-gray-400">
              ({pagination.totalRootComments})
            </span>
          )}
        </h2>
      </div>

      {/* Comment Form */}
      <div className="bg-gray-900/30 rounded-lg p-6">
        <CommentForm tmdbId={tmdbId} />
      </div>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.comment_id}
              comment={comment}
              tmdbId={tmdbId}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-900/50 rounded-lg p-8 text-center">
          <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No comments yet</p>
          <p className="text-gray-500 text-sm">
            Be the first to share your thoughts!
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = index + 1;
              } else if (currentPage <= 3) {
                pageNumber = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + index;
              } else {
                pageNumber = currentPage - 2 + index;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-10 h-10 rounded-lg transition-colors ${
                    pageNumber === currentPage
                      ? "bg-pink-500 text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
};

export default CommentsSection;

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onNextPage, onPrevPage }) => {
  if (totalPages <= 1) return null; // Don't render pagination if there's only one page

  console.log("Pagination rendered with:", { currentPage, totalPages }); // Debug info

  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <button
        onClick={onPrevPage}
        disabled={currentPage === 1}
        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
          currentPage === 1
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-pink-600 text-white hover:bg-pink-700"
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} className="mr-1" />
        <span>Prev</span>
      </button>

      <div className="px-4 py-2 bg-gray-800/60 rounded-lg text-gray-200">
        Page <span className="font-bold text-white">{currentPage}</span> of{" "}
        <span className="font-bold text-white">{totalPages}</span>
      </div>

      <button
        onClick={onNextPage}
        disabled={currentPage >= totalPages}
        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
          currentPage >= totalPages
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-pink-600 text-white hover:bg-pink-700"
        }`}
        aria-label="Next page"
      >
        <span>Next</span>
        <ChevronRight size={20} className="ml-1" />
      </button>
    </div>
  );
};

export default Pagination;

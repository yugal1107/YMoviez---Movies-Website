import React, { useState } from "react";
import { Star } from "lucide-react";

const RatingInput = ({
  rating = 0,
  onRatingChange,
  maxRating = 10,
  size = "h-6 w-6",
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (selectedRating) => {
    if (onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  const handleStarHover = (selectedRating) => {
    setHoverRating(selectedRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="space-y-3">
      <div
        className="flex items-center gap-1 flex-wrap"
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= (hoverRating || rating);

          return (
            <button
              key={index}
              type="button"
              className={`${size} transition-all duration-200 hover:scale-110 ${
                isFilled
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-400 hover:text-yellow-300"
              }`}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleStarHover(starValue)}
            >
              <Star className="w-full h-full" />
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>Rating: {hoverRating || rating || 0}/10</span>
        {hoverRating > 0 && hoverRating !== rating && (
          <span className="text-yellow-400">Click to rate</span>
        )}
      </div>
    </div>
  );
};

export default RatingInput;

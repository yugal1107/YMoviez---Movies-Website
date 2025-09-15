import React from "react";
import { Star } from "lucide-react";

const StarRating = ({
  rating,
  maxRating = 5,
  onRatingChange,
  isInteractive = false,
  size = "h-5 w-5",
}) => {
  const handleStarClick = (selectedRating) => {
    if (isInteractive && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return (
          <Star
            key={index}
            className={`${size} transition-colors duration-200 ${
              isInteractive ? "cursor-pointer hover:text-yellow-400" : ""
            } ${
              isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
            }`}
            onClick={() => handleStarClick(starValue)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;

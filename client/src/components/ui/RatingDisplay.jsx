import React from "react";
import { Star } from "lucide-react";

const RatingDisplay = ({
  rating,
  maxRating = 10,
  showStars = true,
  size = "h-5 w-5",
}) => {
  const filledStars = Math.floor(rating / 2); // Convert 10-point to 5-star display
  const hasHalfStar = rating % 2 >= 1;

  return (
    <div className="flex items-center gap-2">
      {showStars && (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, index) => {
            const isFilled = index < filledStars;
            const isHalf = index === filledStars && hasHalfStar;

            return (
              <div key={index} className="relative">
                <Star className={`${size} text-gray-400`} />
                {(isFilled || isHalf) && (
                  <Star
                    className={`${size} text-yellow-400 fill-yellow-400 absolute top-0 left-0`}
                    style={isHalf ? { clipPath: "inset(0 50% 0 0)" } : {}}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
      <span className="text-lg font-medium">{rating.toFixed(1)}/10</span>
    </div>
  );
};

export default RatingDisplay;

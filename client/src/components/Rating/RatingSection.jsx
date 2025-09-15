import React, { useState } from "react";
import {
  useMovieRatings,
  useUserRating,
  useAddOrUpdateRating,
} from "../../hooks/useRatings";
import { useAuth } from "../../context/authContext";
import StarRating from "../ui/StarRating";
import { Loader2, Users } from "lucide-react";

const RatingSection = ({ tmdbId, tmdbRating }) => {
  const { user } = useAuth();
  const [selectedRating, setSelectedRating] = useState(0);

  const { data: userRating, isLoading: userRatingLoading } =
    useUserRating(tmdbId);
  const { data: movieRatings, isLoading: movieRatingsLoading } =
    useMovieRatings(tmdbId);
  const addRatingMutation = useAddOrUpdateRating();

  // Determine which rating to display - user ratings if available, otherwise TMDB rating
  const displayRating =
    movieRatings?.total_ratings > 0
      ? parseFloat(movieRatings.average_rating) || 0
      : tmdbRating || 0;

  const handleRatingSubmit = () => {
    if (selectedRating > 0) {
      addRatingMutation.mutate({ tmdb_id: tmdbId, rating: selectedRating });
      setSelectedRating(0);
    }
  };

  if (movieRatingsLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Rating</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <StarRating rating={displayRating} />
              <span className="text-lg font-medium">
                {displayRating.toFixed(1)}
              </span>
            </div>
            {movieRatings?.total_ratings > 0 && (
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Users className="h-4 w-4" />
                <span>
                  {movieRatings.total_ratings} review
                  {movieRatings.total_ratings !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
          {movieRatings?.total_ratings === 0 && (
            <p className="text-sm text-gray-400">
              Showing TMDB rating • Be the first to rate!
            </p>
          )}
        </div>

        {user && (
          <div className="bg-gray-800 rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium">Rate this movie</p>
            <div className="flex items-center gap-3">
              <StarRating
                rating={selectedRating || userRating?.rating || 0}
                isInteractive={true}
                onRatingChange={setSelectedRating}
              />
              {(selectedRating > 0 || userRating?.rating) && (
                <button
                  onClick={handleRatingSubmit}
                  disabled={addRatingMutation.isPending || selectedRating === 0}
                  className="px-3 py-1 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm transition-colors"
                >
                  {addRatingMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : userRating?.rating ? (
                    "Update"
                  ) : (
                    "Rate"
                  )}
                </button>
              )}
            </div>
            {userRating?.rating && !selectedRating && (
              <p className="text-xs text-gray-400">
                Your rating: {userRating.rating}/5
              </p>
            )}
          </div>
        )}
      </div>

      {/* Rating Distribution (optional visual enhancement) */}
      {movieRatings?.total_ratings > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-300">
            Rating Distribution
          </p>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = parseInt(movieRatings[`rating_${star}`] || 0);
              const percentage =
                movieRatings.total_ratings > 0
                  ? (count / movieRatings.total_ratings) * 100
                  : 0;

              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{star}★</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-gray-400">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingSection;

import React, { useState } from "react";
import {
  useMovieRatings,
  useUserRating,
  useAddOrUpdateRating,
} from "../../hooks/useRatings";
import { useAuth } from "../../context/authContext";
import RatingDisplay from "../ui/RatingDisplay";
import RatingInput from "../ui/RatingInput";
import { Loader2, Users, LogIn } from "lucide-react";

const RatingSection = ({ tmdbId, tmdbRating }) => {
  const { user } = useAuth();
  const [selectedRating, setSelectedRating] = useState(0);

  const {
    data: userRating,
    isLoading: userRatingLoading,
    error: userRatingError,
  } = useUserRating(tmdbId, !!user); // Only fetch if user is authenticated
  const {
    data: movieRatings,
    isLoading: movieRatingsLoading,
    error: movieRatingsError,
  } = useMovieRatings(tmdbId);
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

  // Handle authentication errors only - ignore 404/no data found errors
  const isAuthError = (error) => {
    return (
      error &&
      (error.message?.includes("Authentication") ||
        error.message?.includes("Unauthorized") ||
        error.status === 401 ||
        error.response?.status === 401)
    );
  };

  if (
    isAuthError(movieRatingsError) ||
    (isAuthError(userRatingError) && user)
  ) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold">Rating</h3>
        <div className="text-center py-4">
          <LogIn className="h-8 w-8 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-400">Login to view and rate this movie</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Rating</h3>
          <div className="flex items-center gap-4">
            <RatingDisplay rating={displayRating} />
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

        {user ? (
          <div className="bg-gray-800 rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium">Rate this movie</p>
            <RatingInput
              rating={selectedRating || userRating?.rating || 0}
              onRatingChange={setSelectedRating}
            />
            {(selectedRating > 0 || userRating?.rating) && (
              <button
                onClick={handleRatingSubmit}
                disabled={addRatingMutation.isPending || selectedRating === 0}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm transition-colors"
              >
                {addRatingMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : userRating?.rating ? (
                  "Update Rating"
                ) : (
                  "Submit Rating"
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-4 text-center space-y-2">
            <LogIn className="h-8 w-8 text-gray-500 mx-auto" />
            <p className="text-sm text-gray-400">Login to rate this movie</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingSection;

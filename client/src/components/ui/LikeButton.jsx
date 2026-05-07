import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { likeMovie, dislikeMovie } from "../../utils/likeUtils";
import { useAuth } from "../../context/authContext";
import useLikedMovies from "../../hooks/use-liked-movies";
import { fetchData } from "../../utils/fetchData";

const LikeButton = ({ id, initialLikeState = false, className = "", iconOnly = false }) => {
  const [isLiked, setIsLiked] = useState(initialLikeState);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { refetchLikedMovies } = useLikedMovies();

  useEffect(() => {
    setIsLiked(initialLikeState);
  }, [initialLikeState]);

  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    try {
      const result = isLiked
        ? await dislikeMovie(
            id,
            user,
            fetchData,
            import.meta.env.VITE_BASE_API_URL
          )
        : await likeMovie(
            id,
            user,
            fetchData,
            import.meta.env.VITE_BASE_API_URL
          );

      if (result.success) {
        setIsLiked(!isLiked);
        refetchLikedMovies();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading}
      className={`${className} ${
        iconOnly
          ? `rounded-full p-1.5 transition-all active:scale-90 ${
              isLiked
                ? "bg-pink-600/80 text-white hover:bg-pink-700"
                : "bg-black/50 text-white hover:bg-black/70"
            }`
          : `px-3 py-1 rounded-full flex items-center gap-1 transition-colors ${
              isLiked
                ? "bg-pink-600 text-white hover:bg-pink-700"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`
      }`}
    >
      {iconOnly ? (
        <motion.div
          key={String(isLiked)}
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <Heart
            className={`h-4 w-4 ${isLiked ? "fill-white" : ""}`}
            strokeWidth={isLiked ? 0 : 1.5}
          />
        </motion.div>
      ) : (
        <Heart
          className={`h-4 w-4 ${isLiked ? "fill-white" : ""}`}
          strokeWidth={isLiked ? 0 : 1.5}
        />
      )}
      {!iconOnly && (
        <span className="hidden sm:inline">{isLiked ? "Liked" : "Like"}</span>
      )}
    </button>
  );
};

export default LikeButton;

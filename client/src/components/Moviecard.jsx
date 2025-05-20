import React, { useState } from "react";
import LikeButton from "./LikeButton";
import PlaylistSelector from "./PlaylistSelector";

const baseimgURL = "https://image.tmdb.org/t/p/w500";

const Moviecard = ({ image_url, name, rating, id, likedMovies }) => {
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);

  const noPosterSVG = (
    <svg
      width="208"
      height="312"
      viewBox="0 0 208 312"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-lg object-cover"
    >
      <rect width="208" height="312" fill="#000000" />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#FFFFFF"
        fontSize="24"
        fontFamily="Arial"
      >
        No Poster
      </text>
    </svg>
  );

  const isLiked = likedMovies?.some((liked) => liked.id === id);

  return (
    <div className="relative w-32 md:w-52 bg-gray-100 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      {image_url ? (
        <img
          src={baseimgURL + image_url}
          alt={name || "No poster available"}
          className="rounded-lg w-36 md:w-52 object-cover"
          loading="lazy"
        />
      ) : (
        noPosterSVG
      )}
      <div className="absolute inset-0 bg-black bg-opacity-0 rounded-lg flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-300 hover:bg-opacity-70 hover:opacity-100">
        <div className="name text-lg font-semibold truncate w-full text-center px-2">
          {name}
        </div>
        <div className="rating mt-1">
          <span className="font-medium">Rating: </span>
          <span className="text-yellow-400">{rating}</span>
        </div>
        <LikeButton id={id} initialLikeState={isLiked} />
        <button
          onClick={() => setShowPlaylistSelector(true)}
          className="mt-2 px-3 py-1 rounded-full bg-gray-700 text-white hover:bg-gray-600 text-sm"
        >
          Add to Playlist
        </button>
      </div>
      {showPlaylistSelector && (
        <PlaylistSelector
          tmdbId={id}
          onClose={() => setShowPlaylistSelector(false)}
        />
      )}
    </div>
  );
};

export default Moviecard;
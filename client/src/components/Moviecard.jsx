import React, { useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, ListPlus } from "lucide-react";
import LikeButton from "./ui/LikeButton";
import DropdownMenu from "./DropdownMenu";
import PlaylistSelector from "./PlaylistSelector";

const baseimgURL = "https://image.tmdb.org/t/p/w500";

const Moviecard = ({ image_url, name, rating, id, likedMovies }) => {
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);

  const isLiked = likedMovies?.some((liked) => liked.id === id);

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

  const menuItems = [
    {
      label: "Add to Playlist",
      icon: <ListPlus className="h-4 w-4" />,
      onClick: () => setShowPlaylistSelector(true),
    },
  ];

  return (
    <div className="group/card relative w-32 md:w-52 bg-gray-100 rounded-lg shadow-lg">
      {/* Poster */}
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

      {/* Hover overlay — purely visual, pointer-events-none so it never blocks clicks below */}
      <div className="pointer-events-none absolute inset-0 bg-black bg-opacity-0 rounded-lg flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-300 group-hover/card:bg-opacity-60 group-hover/card:opacity-100 px-2">
        <div className="text-sm font-semibold truncate w-full text-center px-1">
          {name}
        </div>
        <div className="text-xs text-center mt-1 text-yellow-400">
          ★ {rating?.toFixed(1) ?? "N/A"}
        </div>
      </div>

      {/* Persistent action zone — always visible, stops propagation to prevent accidental navigation */}
      <div
        className="absolute bottom-2 right-2 z-10 flex items-center gap-1"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <LikeButton id={id} initialLikeState={isLiked} iconOnly />
        <DropdownMenu
          trigger={
            <button
              type="button"
              className="rounded-full bg-black/50 p-1 text-white hover:bg-black/70 transition-all active:scale-90"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          }
          items={menuItems}
          align="right"
          width="w-44"
          dropUp
        />
      </div>

      {showPlaylistSelector &&
        createPortal(
          <PlaylistSelector
            tmdbId={id}
            onClose={() => setShowPlaylistSelector(false)}
          />,
          document.body
        )}
    </div>
  );
};

export default Moviecard;

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePlaylists from "../hooks/usePlaylists";
import Movietype from "../components/Movietype";
import { Loader2, Film, MoreVertical, Trash2, Eye } from "lucide-react";
import usePlaylistMovies from "../hooks/usePlaylistMovies";
import DropdownMenu from "../components/DropdownMenu";

const PlaylistPage = () => {
  const {
    playlists,
    isLoading: playlistsLoading,
    deletePlaylist,
  } = usePlaylists();

  if (playlistsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gray-100">Your Playlists</span>
          </h1>
          <p className="text-gray-400">
            {playlists.length > 0
              ? `You have ${playlists.length} playlist${
                  playlists.length > 1 ? "s" : ""
                }`
              : "You don't have any playlists yet. Create one to get started!"}
          </p>
        </div>

        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-800/30 rounded-xl">
            <Film className="h-16 w-16 text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Playlists Found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Create your first playlist by clicking the "Add to Playlist"
              button on any movie.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {playlists.map((playlist) => (
              <PlaylistSection
                key={playlist.playlist_id}
                playlist={playlist}
                onDelete={() => deletePlaylist(playlist.playlist_id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PlaylistSection = ({ playlist, onDelete }) => {
  const { movies, isLoading } = usePlaylistMovies(playlist.playlist_id);
  const navigate = useNavigate();

  // Create dropdown menu items
  const menuItems = [
    {
      label: "View All",
      icon: <Eye className="h-4 w-4" />,
      onClick: () => navigate(`/playlist/${playlist.playlist_id}`),
    },
    {
      label: "Delete Playlist",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => onDelete(),
      className: "text-red-400 hover:bg-gray-700 hover:text-red-300",
    },
  ];

  // Create the dropdown trigger button
  const dropdownTrigger = (
    <button
      className="p-2 rounded-full hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
      aria-label="Playlist options"
    >
      <MoreVertical className="h-5 w-5 text-gray-400" />
    </button>
  );

  return (
    <div className="relative">
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
        </div>
      ) : movies.length === 0 ? (
        <div className="bg-gray-900/50 rounded-lg p-6 mb-6 relative">
          <div className="absolute top-4 right-4">
            <DropdownMenu trigger={dropdownTrigger} items={menuItems} />
          </div>
          <div className="flex items-center gap-2 pr-10">
            <Film className="h-6 w-6 text-pink-500" />
            <h2 className="text-2xl font-bold">{playlist.name}</h2>
          </div>
          <p className="text-gray-400 mt-4">No movies in this playlist.</p>
        </div>
      ) : (
        <div className="relative group">
          {/* Improved positioning of dropdown menu */}
          <div className="absolute top-0 right-0 z-10">
            <DropdownMenu trigger={dropdownTrigger} items={menuItems} />
          </div>
          <Movietype
            data={movies}
            title={playlist.name}
            icon={<Film className="h-6 w-6 text-pink-500" />}
            viewAllLink={`/playlist/${playlist.playlist_id}`}
            scrollId={`playlist-${playlist.playlist_id}`}
            hideViewAll={true} // Hide the View All button since we have it in the dropdown
          />
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;

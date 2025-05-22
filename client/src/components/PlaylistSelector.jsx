import React, { useState, useEffect } from "react";
import { Plus, X, Check, Loader2 } from "lucide-react";
import usePlaylists from "../hooks/usePlaylists";
import { addMovieToPlaylist } from "../utils/playlistUtils";
import { useAuth } from "../context/authContext";
import { fetchData } from "../utils/fetchData";

const PlaylistSelector = ({ tmdbId, onClose }) => {
  const {
    playlists,
    isLoading: playlistsLoading,
    createPlaylist,
  } = usePlaylists();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylists, setSelectedPlaylists] = useState(new Set());
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    await createPlaylist(newPlaylistName);
    setNewPlaylistName("");
  };

  const togglePlaylistSelection = (playlistId) => {
    setSelectedPlaylists((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(playlistId)) {
        newSet.delete(playlistId);
      } else {
        newSet.add(playlistId);
      }
      return newSet;
    });
  };

  const handleConfirm = async () => {
    if (selectedPlaylists.size === 0) return;
    setIsAdding(true);
    try {
      // Add movie to each selected playlist using addMovieToPlaylist directly
      for (const playlistId of selectedPlaylists) {
        await addMovieToPlaylist(
          playlistId,
          tmdbId,
          user,
          fetchData,
          import.meta.env.VITE_BASE_API_URL
        );
      }
      setTimeout(() => {
        setIsOpen(false);
        onClose();
      }, 500); // Close modal after success
    } catch (error) {
      console.error("Error adding movie to playlists:", error);
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] transition-opacity duration-300">
      <div
        className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100 relative"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add to Playlists</h2>
          <button
            onClick={() => {
              setIsOpen(false);
              onClose();
            }}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Create New Playlist */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Create New Playlist
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 placeholder-gray-400"
              placeholder="Enter playlist name"
              disabled={isAdding}
            />
            <button
              onClick={handleCreatePlaylist}
              className="p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center"
              disabled={!newPlaylistName.trim() || isAdding}
              aria-label="Create new playlist"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Select Playlists */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Playlists
          </label>
          {playlistsLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
            </div>
          ) : playlists.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              No playlists found. Create one above!
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto rounded-lg border border-gray-700 p-2">
              {playlists.map((playlist) => {
                const isSelected = selectedPlaylists.has(playlist.playlist_id);
                return (
                  <button
                    key={playlist.playlist_id}
                    onClick={() =>
                      togglePlaylistSelection(playlist.playlist_id)
                    }
                    disabled={isAdding}
                    className={`w-full p-3 rounded-md text-left transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? "bg-pink-500/20 border-pink-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    } border border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={`Select playlist ${playlist.name}`}
                  >
                    <span>{playlist.name}</span>
                    {isSelected && <Check className="h-5 w-5 text-pink-500" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Confirm Button */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setIsOpen(false);
              onClose();
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200"
            disabled={isAdding}
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 transition-colors duration-200 flex items-center gap-2"
            disabled={isAdding || selectedPlaylists.size === 0}
            aria-label="Confirm adding to playlists"
          >
            {isAdding ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Adding...
              </>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistSelector;

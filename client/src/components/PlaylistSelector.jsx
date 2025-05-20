import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import usePlaylists from "../hooks/usePlaylists";
import usePlaylistMovies from "../hooks/usePlaylistMovies";

const PlaylistSelector = ({ tmdbId, onClose }) => {
  const { playlists, isLoading: playlistsLoading, createPlaylist } = usePlaylists();
  const [isOpen, setIsOpen] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Use the hook at the top level, but only for the selected playlist
  const { addMovie } = usePlaylistMovies(selectedPlaylist);

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

  const handleAddToPlaylist = async (playlistId) => {
    setIsAdding(true);
    try {
      setSelectedPlaylist(playlistId);
      await addMovie(tmdbId);
      setTimeout(() => {
        setIsOpen(false);
        onClose();
      }, 500); // Close modal after success
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Add to Playlist</h2>
          <button
            onClick={() => {
              setIsOpen(false);
              onClose();
            }}
            className="text-gray-400 hover:text-white"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Create New Playlist
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="flex-1 p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter playlist name"
            />
            <button
              onClick={handleCreatePlaylist}
              className="p-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:opacity-50"
              disabled={!newPlaylistName.trim()}
              aria-label="Create playlist"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Select Playlist
          </label>
          {playlistsLoading ? (
            <p className="text-gray-400">Loading playlists...</p>
          ) : playlists.length === 0 ? (
            <p className="text-gray-400">No playlists found.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {playlists.map((playlist) => (
                <button
                  key={playlist.playlist_id}
                  onClick={() => handleAddToPlaylist(playlist.playlist_id)}
                  disabled={isAdding}
                  className={`w-full p-2 rounded-md text-left transition-colors ${
                    selectedPlaylist === playlist.playlist_id
                      ? "bg-pink-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {playlist.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistSelector;
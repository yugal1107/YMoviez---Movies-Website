import React from "react";
import { Bookmark } from "lucide-react";
import useWatchStatus from "../../hooks/use-watch-status";
import toast from "react-hot-toast";

const WatchlistButton = ({ tmdbId, className = "" }) => {
  const { watchStatus, setWatchStatus, isLoading } = useWatchStatus();

  const currentStatus = watchStatus.find((m) => m.tmdb_id === tmdbId)?.status;
  const isInWatchlist = currentStatus === "want_to_watch";

  const handleToggleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWatchlist) {
      toast("Already in your watchlist.", { icon: "👍" });
      return;
    }
    setWatchStatus(tmdbId, "want_to_watch");
  };

  return (
    <button
      onClick={handleToggleWatchlist}
      disabled={isLoading}
      className={`${className} ${
        isInWatchlist
          ? "bg-yellow-600 hover:bg-yellow-700"
          : "bg-gray-700 hover:bg-gray-600"
      }`}
    >
      <Bookmark className="h-4 w-4" />
      <span className="hidden sm:inline">
        {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
      </span>
    </button>
  );
};

export default WatchlistButton;

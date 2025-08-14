import React from "react";
import { Eye } from "lucide-react";
import useWatchStatus from "../../hooks/use-watch-status";
import toast from "react-hot-toast";

const WatchedButton = ({ tmdbId, className = "" }) => {
  const { watchStatus, setWatchStatus, isLoading } = useWatchStatus();

  const currentStatus = watchStatus.find((m) => m.tmdb_id === tmdbId)?.status;
  const isWatched = currentStatus === "watched";

  const handleToggleWatched = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWatched) {
      toast("Already marked as watched.", { icon: "👍" });
      return;
    }
    setWatchStatus(tmdbId, "watched");
  };

  return (
    <button
      onClick={handleToggleWatched}
      disabled={isLoading}
      className={`${className} ${
        isWatched
          ? "bg-green-600 hover:bg-green-700"
          : "bg-gray-700 hover:bg-gray-600"
      }`}
    >
      <Eye className="h-4 w-4" />
      <span className="hidden sm:inline">
        {isWatched ? "Watched" : "Mark as Watched"}
      </span>
    </button>
  );
};

export default WatchedButton;

import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../utils/fetchData";
import { Loader2, ListPlus, Eye, Bookmark } from "lucide-react";
import Poster from "./Poster";
import MovieInfo from "./MovieInfo";
import RecommendedMovies from "./RecommendedMovies";
import useLikedMovies from "../../hooks/use-liked-movies";
import useWatchStatus from "../../hooks/use-watch-status";
import LikeButton from "../../components/LikeButton";
import PlaylistSelector from "../../components/PlaylistSelector";
import toast from "react-hot-toast";

const baseimgURL = "https://image.tmdb.org/t/p/original";

const Movie = () => {
  const { movieid } = useParams();
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);
  const { likedMovies } = useLikedMovies();
  const { watchStatus, setWatchStatus } = useWatchStatus();

  // Fetch movie details and cast using React Query
  const { data: movieData, isLoading: movieLoading } = useQuery({
    queryKey: ["movieDetails", movieid],
    queryFn: () =>
      fetchData(
        `${import.meta.env.VITE_BASE_API_URL}api/tmdb/movie/${movieid}`
      ),
  });

  const { data: castData, isLoading: castLoading } = useQuery({
    queryKey: ["movieCast", movieid],
    queryFn: () =>
      fetchData(
        `${import.meta.env.VITE_BASE_API_URL}api/tmdb/movie/${movieid}/credits`
      ),
  });

  // Fetch recommendations using React Query
  const { data: recommendations = [], isLoading: recommendationsLoading } =
    useQuery({
      queryKey: ["recommendations", movieid],
      queryFn: async () => {
        const recs = await fetchData(
          `${
            import.meta.env.VITE_BASE_ML_URL
          }/recommend?tmdb_id=${movieid}&top_n=10`
        );
        const details = await Promise.all(
          recs.map(async (rec) => {
            const movieDetails = await fetchData(
              `${import.meta.env.VITE_BASE_API_URL}api/tmdb/movie/${rec.tmdbId}`
            );
            return {
              id: rec.tmdbId,
              title: movieDetails.title,
              name: movieDetails.title,
              poster_path: movieDetails.poster_path,
              vote_average: movieDetails.vote_average || rec.rating,
            };
          })
        );
        return details.filter((movie) => movie !== null);
      },
      enabled: !!movieData,
    });

  if (movieLoading || castLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
      </div>
    );
  }

  const movie = movieData || {};
  const cast = castData?.cast || [];
  const isLiked = likedMovies?.some((liked) => liked.id === parseInt(movieid));
  const currentWatchStatus = watchStatus.find(
    (m) => m.tmdb_id === parseInt(movieid)
  )?.status;

  const handleWatchStatusUpdate = (status) => {
    setWatchStatus(parseInt(movieid), status);
    toast.success(`Movie marked as ${status.replace("_", " ")}!`);
  };

  const renderRecommendationsSection = () => {
    if (recommendationsLoading) {
      return (
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-3xl font-bold">Recommendations</h2>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            <span className="ml-2 text-gray-400">
              Loading recommendations...
            </span>
          </div>
        </section>
      );
    }

    if (recommendations.length > 0) {
      return (
        <RecommendedMovies
          movies={recommendations}
          title="Recommended Movies"
          subtitle="Based on what you're viewing"
          isPoweredByML={true}
        />
      );
    }

    return (
      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-3xl font-bold">Recommendations</h2>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-6 text-center">
          <p className="text-gray-400">No recommendations found.</p>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className="relative h-[60vh] w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${baseimgURL}${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="container mx-auto absolute bottom-0 left-0 right-0 p-8 flex gap-8">
          <Poster baseimgURL={baseimgURL} poster_path={movie.poster_path} />
          <div className="flex-1 space-y-4 self-end">
            <MovieInfo movie={movie} />
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <LikeButton
                id={parseInt(movieid)}
                initialLikeState={isLiked}
                className="px-5 py-2.5 text-base font-medium rounded-full flex items-center gap-2 shadow-md transition-all duration-300 transform hover:scale-105"
              />
              <button
                onClick={() => handleWatchStatusUpdate("watched")}
                className={`px-5 py-2.5 rounded-full text-white text-base font-medium flex items-center gap-2 shadow-md transition-all duration-300 transform hover:scale-105 ${
                  currentWatchStatus === "watched"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <Eye className="h-5 w-5" />
                {currentWatchStatus === "watched"
                  ? "Watched"
                  : "Mark as Watched"}
              </button>
              <button
                onClick={() => handleWatchStatusUpdate("want_to_watch")}
                className={`px-5 py-2.5 rounded-full text-white text-base font-medium flex items-center gap-2 shadow-md transition-all duration-300 transform hover:scale-105 ${
                  currentWatchStatus === "want_to_watch"
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <Bookmark className="h-5 w-5" />
                {currentWatchStatus === "want_to_watch"
                  ? "In Watchlist"
                  : "Add to Watchlist"}
              </button>
              <button
                onClick={() => setShowPlaylistSelector(true)}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:from-indigo-700 hover:to-blue-600 text-base font-medium flex items-center gap-2 shadow-md transition-all duration-300 transform hover:scale-105"
              >
                <ListPlus className="h-5 w-5" />
                Add to Playlist
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Genres</h2>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <Link
                  key={genre.id}
                  to={`/genre/${genre.id}`}
                  className="px-4 py-2 rounded-full bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 transition"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Production Companies</h2>
            <div className="flex flex-wrap gap-2">
              {movie.production_companies?.map((company) => (
                <span
                  key={company.id}
                  className="px-4 py-2 rounded-full bg-gray-800 text-gray-300"
                >
                  {company.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Cast</h2>
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {cast.map((actor) => (
              <Link
                key={actor.id}
                to={`/cast/${actor.id}/${actor.name}`}
                className="flex-shrink-0 w-44 bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition duration-300"
              >
                <img
                  src={
                    actor.profile_path
                      ? `${baseimgURL}${actor.profile_path}`
                      : "/images/profile.png"
                  }
                  alt={actor.name}
                  className="w-full aspect-[2/3] object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{actor.name}</h3>
                  <p className="text-sm text-gray-400">{actor.character}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {renderRecommendationsSection()}
      </div>

      {showPlaylistSelector && (
        <PlaylistSelector
          tmdbId={parseInt(movieid)}
          onClose={() => setShowPlaylistSelector(false)}
        />
      )}
    </div>
  );
};

export default Movie;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchData } from "../../services/fetchData";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Poster from "./Poster";
import MovieInfo from "./MovieInfo";
import RecommendedMovies from "./RecommendedMovies";

const baseimgURL = "https://image.tmdb.org/t/p/original";

const Movie = () => {
  const { movieid } = useParams();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [recommendationsError, setRecommendationsError] = useState(null);

  // Fetch main movie data first
  const getMovieData = async () => {
    try {
      setLoading(true);
      // Fetch main movie details
      const responseData = await fetchData(
        `${import.meta.env.VITE_BASE_API_URL}api/movie/details/${movieid}`
      );

      // Fetch cast details
      const castData = await fetchData(
        `${import.meta.env.VITE_BASE_API_URL}api/movie/cast/${movieid}`
      );

      setMovie(responseData.movieDetails);
      setCast(castData.castData.cast);
    } catch (error) {
      console.error("Error fetching movie data:", error);
    } finally {
      setLoading(false);
      // Now fetch recommendations separately
      getRecommendations();
    }
  };

  // Separate function to fetch recommendations after main content loads
  const getRecommendations = async () => {
    setRecommendationsLoading(true);
    setRecommendationsError(null);

    try {
      const recommendationResponse = await axios.get(
        `https://movieml.yugal.tech/recommend?tmdb_id=${movieid}&top_n=10`
      );

      if (
        recommendationResponse.data &&
        recommendationResponse.data.length > 0
      ) {
        // Process the recommendations to get detailed info for each movie
        const recommendedMoviesDetails = await Promise.all(
          recommendationResponse.data.map(async (rec) => {
            try {
              // Fetch details for each recommended movie
              const details = await fetchData(
                `${import.meta.env.VITE_BASE_API_URL}api/movie/details/${
                  rec.tmdbId
                }`
              );
              return {
                id: rec.tmdbId,
                title: details.movieDetails.title,
                name: details.movieDetails.title,
                poster_path: details.movieDetails.poster_path,
                vote_average: details.movieDetails.vote_average || rec.rating,
              };
            } catch (error) {
              console.error(
                `Error fetching details for movie ${rec.tmdbId}:`,
                error
              );
              return null;
            }
          })
        );
        // Filter out any null values from failed requests
        setRecommendations(
          recommendedMoviesDetails.filter((movie) => movie !== null)
        );
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);

      // Check if it's the "movie not found in dataset" error
      if (error.response && error.response.data && error.response.data.detail) {
        if (error.response.data.detail.includes("not found in dataset")) {
          setRecommendationsError(
            "This movie is not in our recommendation database."
          );
        } else {
          setRecommendationsError("Error loading recommendations.");
        }
      } else {
        setRecommendationsError("Error loading recommendations.");
      }

      setRecommendations([]);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  useEffect(() => {
    getMovieData();
  }, [movieid]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
      </div>
    );
  }

  // Render UI for recommendations section based on loading and error states
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

    if (recommendationsError) {
      return (
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-3xl font-bold">Recommendations</h2>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-6 text-center">
            <p className="text-gray-400">{recommendationsError}</p>
          </div>
        </section>
      );
    }

    if (recommendations && recommendations.length > 0) {
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
          <p className="text-gray-400">
            No recommendations found for this movie.
          </p>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Backdrop */}
      <div
        className="relative h-[60vh] w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${baseimgURL}${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="container mx-auto absolute bottom-0 left-0 right-0 p-8 flex gap-8">
          <Poster baseimgURL={baseimgURL} poster_path={movie.poster_path} />
          {/* Movie Info */}
          <MovieInfo movie={movie} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Genres and Production */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Genres</h2>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
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
              {movie.production_companies.map((company) => (
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

        {/* Cast Section */}
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

        {/* Recommendations Section - dynamically rendered based on state */}
        {renderRecommendationsSection()}
      </div>
    </div>
  );
};

export default Movie;

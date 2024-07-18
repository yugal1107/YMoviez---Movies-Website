import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchData } from "../services/fetchData";
import { Link } from "react-router-dom";

const baseimgURL = "https://image.tmdb.org/t/p/w500";

const Movie = (props) => {
  const { movieid } = useParams();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState();
  console.log("Params : ", movieid);

  const getMovieData = async () => {
    try {
      setLoading(true);
      const responseData = await fetchData(
        `${import.meta.env.VITE_BASE_API_URL}api/movie/details/${movieid}`
      );
      const castData = await fetchData(
        `${import.meta.env.VITE_BASE_API_URL}api/movie/cast/${movieid}`
      );
      console.log("Cast Data : ", castData.castData);
      console.log("Movie Details : ", responseData.movieDetails);
      setCast(castData.castData.cast);
      setMovie(responseData.movieDetails);
    } catch (error) {
      console.error("Error occured while fetching movie Details : ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovieData();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold mb-6">{movie.title}</h1>
        <div className="flex flex-col md:flex-row">
          <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-6">
            <img
              src={`${baseimgURL}${movie.poster_path}`}
              alt="poster-image"
              className="w-full md:w-64"
            />
          </div>
          <div className="md:flex-1">
            <div className="mb-4">
              <span className="text-xl font-semibold">Name:</span>{" "}
              <span>{movie.title}</span>
            </div>
            <div className="mb-4">
              <span className="text-xl font-semibold">Overview:</span>{" "}
              <span>{movie.overview}</span>
            </div>
            <div className="mb-4">
              <span className="text-xl font-semibold">Genres:</span>
              <div>
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <span className="text-xl font-semibold">
                Production Companies:
              </span>
              <div>
                {movie.production_companies.map((company) => (
                  <span
                    key={company.id}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                  >
                    {company.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <span className="text-xl font-semibold">Average Rating:</span>{" "}
              <span>{movie.vote_average}</span>
            </div>
            <div className="mb-4">
              <span className="text-xl font-semibold">Release Date:</span>{" "}
              <span>{movie.release_date}</span>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-3xl font-bold mb-6">Movie Cast</h2>
          <div className="flex flex-wrap">
            {cast.map((actor) => (
              <a
                key={actor.id}
                href={`/cast/${actor.id}/${actor.name}`}
                className="w-full sm:w-1/2 lg:w-1/4 p-4"
              >
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <img
                    src={
                      actor.profile_path
                        ? `${baseimgURL}${actor.profile_path}`
                        : "/images/profile.png"
                    }
                    alt="profile"
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                  />
                  <div className="text-center">
                    <span className="block text-lg font-semibold">
                      {actor.name}
                    </span>
                    <span className="block text-sm text-gray-500">
                      as {actor.character}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Movie;

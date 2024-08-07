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
    <div className="min-h-screen bg-green-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{movie.title}</h1>
        <div className="flex flex-col md:flex-row rounded-3xl bg-green-200 p-5">
          <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-6">
            <img
              src={`${baseimgURL}${movie.poster_path}`}
              alt="poster-image"
              className="w-full md:w-64 rounded-xl"
            />
          </div>
          <div className="md:flex-1">
            {/* <div className="mb-4">
              <span className="text-xl font-semibold">Name:</span>{" "}
              <span>{movie.title}</span>
            </div> */}
            <div className="mb-4">
              <span className="text-green-800 block md:inline text-2xl md:text-2xl font-semibold">
                Overview :{" "}
              </span>{" "}
              <span className="text-lg md:text-xl font-normal">
                {movie.overview}
              </span>
            </div>
            <div className="mb-4">
              <span className="block py-2 md:inline text-green-800 text-2xl font-semibold pr-7">
                Genres :
              </span>
              <div className="flex flex-wrap">
                {movie.genres.map((genre) => (
                  <a
                    key={genre.id}
                    className="flex justify-center items-center"
                    href=""
                  >
                    <span
                      key={genre.id}
                      className="inline-block bg-green-300 rounded-xl px-2 md:px-3 py-1 text-lg md:text-xl font-semibold text-gray-700 mr-2 mb-2 text-center"
                    >
                      {genre.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <span className="block md:inline text-2xl py-2 font-semibold text-green-800 pr-7">
                Production Companies :
              </span>
              <div className="flex flex-wrap">
                {movie.production_companies.map((company) => (
                  <span
                    key={company.id}
                    className="inline-block bg-green-300 rounded-xl px-3 py-1 text-lg md:text-xl font-semibold text-gray-700 mr-2 mb-2"
                  >
                    {company.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <span className="text-2xl font-semibold text-green-800">
                Average Rating :
              </span>{" "}
              <span className="text-lg md:text-xl font-medium pl-2">
                {movie.vote_average}
              </span>
            </div>
            <div className="mb-4">
              <span className="text-2xl text-green-800 font-semibold">
                Release Date :
              </span>{" "}
              <span className="text-lg md:text-xl font-medium pl-2">
                {movie.release_date}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-10 bg-green-200 p-5 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Movie Cast</h2>
          <div className="flex overflow-scroll gap-2">
            {cast.map((actor) => (
              <a
                key={actor.id}
                href={`/cast/${actor.id}/${actor.name}`}
                className="flex-shrink-0 w-36 hover:scale-105 transition-transform duration-300"
              >
                <div className="bg-white rounded-lg shadow-lg">
                  <img
                    src={
                      actor.profile_path
                        ? `${baseimgURL}${actor.profile_path}`
                        : "/images/profile.png"
                    }
                    alt="profile"
                    className="rounded-lg"
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

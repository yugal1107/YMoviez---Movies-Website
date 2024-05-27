import { React, useState, useEffect } from "react";
import Movietype from "../components/Movietype.jsx";
import { fetchData } from "../services/fetchData.js";
// import data from "../../public/data.json";

// const movies = data.results;
// console.log(movies);
const Home = () => {
  const [loading, setLoading] = useState(true);
  const [movieData, setMovieData] = useState({});
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  const getData = async () => {
    try {
      setLoading(true);
      const responseData = await fetchData("/api/movie/home");
      console.log("MOvieData : ", responseData.movieData);
      setMovieData(responseData.movieData);
      setName(responseData.user.name);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="p-1">
      <div className="p-4">
        <span className="text-9xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          W
        </span>
        <h1 className="inline text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          elcome <span className="text-red-500">{name}</span> to the new world
          of movies.
        </h1>
      </div>

      <Movietype data={movieData.popular_movies} title="Popular Movies" />
      <Movietype data={movieData.upcoming_movies} title="Upcoming Movies" />
    </div>
  );
};

export default Home;

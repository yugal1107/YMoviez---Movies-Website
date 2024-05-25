import React, { useState , useEffect } from "react";
import Movietype from "../components/Movietype.jsx";
import { fetchData } from "../services/fetchData.js";
// import data from "../../public/data.json";

// const movies = data.results;
// console.log(movies);
const Home = () => {
  // const [movieData, setMoviedata] = useState({});

  useEffect(() => {
    const movieData = fetchData("/api/movie/home");
    console.log(movieData);
    // setMoviedata(movieData);
  }, []);

  return (
    <div className="p-1">
      <div className="p-4">
        <span className="text-9xl">W</span>
        <h1 className="inline text-5xl">elcome to the new world of movies.</h1>
      </div>
      {/* 
      <Movietype data={movies} />
      <Movietype data={movies} /> */}
    </div>
  );
};

export default Home;

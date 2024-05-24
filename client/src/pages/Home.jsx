import React from "react";
import Movietype from "../components/Movietype.jsx";
import data from "../../public/data.json";
import Cookies from "js-cookie";

const movies = data.results;
console.log(movies);
const Home = () => {
  try {
    const token = Cookies.get("uid");
    console.log(token);
  } catch (err) {
    console.log(err);
  }
  return (
    <div className="p-1">
      <div className="p-4">
        <span className="text-9xl">W</span>
        <h1 className="inline text-5xl">elcome to the new world of movies.</h1>
      </div>

      <Movietype data={movies} />
      <Movietype data={movies} />
    </div>
  );
};

export default Home;

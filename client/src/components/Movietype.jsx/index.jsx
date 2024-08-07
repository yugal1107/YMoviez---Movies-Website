import React from "react";
import Moviecard from "../Moviecard";
import { Link } from "react-router-dom";

const Movietype = (props) => {
  return (
    <div className="scroll-smooth block flex-col rounded-3xl p-3 m-2 overflow-x-scroll">
      {/* {console.log(props)} */}
      <div className="text-3xl p-1 pb-5 font-bold">{props.title}</div>
      <div className="flex gap-5">
        {props.data.results.map((movie) => {
          // console.log(movie.id);

          return (
            <Link to={`/movie/${movie.id}`}>
              <Moviecard
                key={movie.id}
                name={movie.title || movie.name}
                description={movie.overview}
                rating={movie.vote_average}
                image_url={movie.poster_path}
                id={movie.id}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Movietype;

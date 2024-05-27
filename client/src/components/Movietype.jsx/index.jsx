import React from "react";
import Moviecard from "../Moviecard";

const Movietype = (props) => {
  return (
    <div className="scroll-smooth block flex-col rounded-3xl bg-slate-800 text-white p-5 m-2 overflow-x-scroll">
      {console.log(props)}
      <div className="text-3xl p-1 pb-5 font-bold">{props.title}</div>
      <div className="flex gap-2">
        {props.data.map((movie) => {
          console.log(movie.id);

          return (
            <Moviecard
              key={movie.id}
              name={movie.original_title || movie.name}
              description={movie.overview}
              rating={movie.vote_average}
              image_url={movie.poster_path}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Movietype;

import React from "react";
import Moviecard from "../Moviecard";

const Movietype = (props) => {
  return (
    <div className="block flex-col rounded-lg bg-slate-800 text-white p-3 m-2 overflow-x-scroll">
        {console.log(props)}
      <div className="text-3xl p-1">Popular Movies</div>
      <div className="flex gap-1">
        {props.data.map((movie) => {
            
          return <Moviecard
            key={movie.id}
            name={movie.original_title}
            description={movie.overview}
            rating={movie.vote_average}
          />;
        })}
      </div>
    </div>
  );
};

export default Movietype;

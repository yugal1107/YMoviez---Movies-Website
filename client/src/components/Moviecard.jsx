import React from "react";

const baseimgURL = 'https://image.tmdb.org/t/p/w500';

const Moviecard = (props) => {
  return (
    <div className="flex gap-1">
      <div className="flex-col align-middle justify-between gap-1 p-3 w-60">
        <img
          src={baseimgURL + props.poster_path}
          className="img rounded-lg"
        ></img>
        <div className="name text-2xl">{props.name}</div>
        <div className="rating ">
          <span>Rating : </span>
          <span>{props.rating}</span>
        </div>
        {/* <div className="desciption text-sm truncate">{props.description}</div> */}
      </div>
    </div>
  );
};

export default Moviecard;

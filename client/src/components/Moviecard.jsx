import React from "react";

const baseimgURL = "https://image.tmdb.org/t/p/w500";

const Moviecard = (props) => {
  // console.log(props);
  return (
    <div className="flex flex-col justify-between gap-1 p-2 w-60 aspect-">
      <img
        src={baseimgURL + props.image_url}
        className="rounded-lg max-w-60"
      ></img>
      <div>
        <div className="name text-2xl truncate">{props.name}</div>
        <div className="rating">
          <span>Rating : </span>
          <span>{props.rating}</span>
        </div>
      </div>
      {/* <div className="desciption text-sm truncate">{props.description}</div> */}
    </div>
  );
};

export default Moviecard;

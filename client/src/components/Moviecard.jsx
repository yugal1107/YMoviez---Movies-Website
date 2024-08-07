import React from "react";

const baseimgURL = "https://image.tmdb.org/t/p/w500";

const Moviecard = ({ image_url, name, rating }) => {
  return (
    <div className="flex flex-col justify-between gap-1 w-32 md:w-52 bg-gray-100 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <img
        src={image_url ? baseimgURL + image_url : "/images/movie.jpeg"}
        alt={name}
        className="rounded-lg w-36 md:w-52 object-cover"
      />
      {/* <div className="mt-2 p-2">
        <div className="name text-xl font-semibold truncate">{name}</div>
        <div className="rating mt-1">
          <span className="font-medium">Rating: </span>
          <span className="text-yellow-500">{rating}</span>
        </div>
      </div> */}
    </div>
  );
};

export default Moviecard;

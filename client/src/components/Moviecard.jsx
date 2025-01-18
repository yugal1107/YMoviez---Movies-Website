import React from "react";

const baseimgURL = "https://image.tmdb.org/t/p/w500";

const Moviecard = ({ image_url, name, rating }) => {
  return (
    <div className="relative w-32 md:w-52 bg-gray-100 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Image Section */}
      <img
        src={image_url ? baseimgURL + image_url : "/images/movie.jpeg"}
        alt={name}
        className="rounded-lg w-36 md:w-52 object-cover"
      />

      {/* Overlay Section */}
      <div className="absolute inset-0 bg-black bg-opacity-0 rounded-lg flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-300 hover:bg-opacity-70 hover:opacity-100">
        <div className="name text-xl font-semibold truncate">{name}</div>
        <div className="rating mt-1">
          <span className="font-medium">Rating: </span>
          <span className="text-yellow-400">{rating}</span>
        </div>
      </div>
    </div>
  );
};

export default Moviecard;

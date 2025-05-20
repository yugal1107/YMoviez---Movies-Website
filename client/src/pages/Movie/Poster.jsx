import React, { memo } from "react";

const Poster = ({ baseimgURL, poster_path }) => {
  return (
    <div className="hidden md:block w-64 translate-y-16">
      <img
        src={`${baseimgURL}${poster_path}`}
        alt="Movie Poster"
        className="w-full rounded-lg shadow-2xl ring-1 ring-white/10 transition-transform hover:scale-105"
        loading="lazy"
      />
    </div>
  );
};

export default memo(Poster);
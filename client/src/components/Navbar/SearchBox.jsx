import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClick = () => {
    navigate(`/search/${query}`);
  };

  return (
    <div className="flex items-center justify-center py-4">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        className=" sm:w-1/2 lg:w-1/3 pr-20 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search here ..."
      />
      <button
        onClick={handleClick}
        className="px-2  bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBox;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

const SearchBox = ({ className }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClick = () => {
    navigate(`/search/${query}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate(`/search/${query}`);
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <input
        type="text"
        value={query}
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
        className="h-8 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search here ..."
      />
      <button
        onClick={handleClick}
        className="px-2 h-8 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center align-center"
      >
        <SearchOutlined className="text-2xl" />
      </button>
    </div>
  );
};

export default SearchBox;

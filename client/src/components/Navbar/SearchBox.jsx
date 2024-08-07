import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

const SearchBox = ({ className }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClick = () => {
    navigate(`/search/${query}`);
    setShowSearch(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate(`/search/${query}`);
    }
  };

  return (
    <>
      <SearchOutlined
        className="text-white px-1 md:hidden hover:bg-green-500 rounded-lg"
        onClick={() => setShowSearch(!showSearch)}
      />
      <div
        className={`absolute w-full left-0 p-2 bg-green-400 lg:relative lg:top-0 lg:p-0 lg:w-auto flex items-center justify-center ease-in-out ${className} ${
          showSearch ? `top-14` : `-top-60`
        }`}
      >
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
    </>
  );
};

export default SearchBox;

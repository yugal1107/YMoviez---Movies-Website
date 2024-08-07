import React from "react";
import { Link } from "react-router-dom";

const NavElement = ({ title, link, className }) => {
  return (
    <div
      className={`m-0 text-white h-full rounded hover:bg-green-500 px-2 transition duration-500 ${className}`}
    >
      {title}
    </div>
  );
};

export default NavElement;

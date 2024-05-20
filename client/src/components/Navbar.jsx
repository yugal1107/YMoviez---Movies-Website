import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-green-400 flex justify-between items-center p-2 font-thin text-3xl">
      <div className="flex gap-3 justify-around items-center">
        <Link to="/" className="text-white font-bold">Home</Link>
        <Dropdown />
        <Link to="/about" className="text-white font-bold">About</Link>
        <Link to="/contact" className="text-white font-bold">Contact</Link>
      </div>
      <div>
        {/* <Link to="/login" className="text-white font-bold">Login</Link> */}
      </div>
    </nav>

  );
};

export default Navbar;
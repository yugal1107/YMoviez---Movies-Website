import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import { fetchData } from "../../services/fetchData";

const Navbar = () => {
  const [name, setName] = useState("Guest");

  const getName = async () => {
    try {
      const nameData = await fetchData("/api/navbar");
      setName(nameData.name);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getName();
  }, []);

  return (
    <nav className="bg-green-400 flex justify-between items-center p-2 font-thin text-3xl">
      <div className="flex gap-3 justify-around items-center">
        <Link to="/" className="text-white font-bold">
          Home
        </Link>
        <Dropdown />
        <Link to="/about" className="text-white font-bold">
          About
        </Link>
        <Link to="/contact" className="text-white font-bold">
          Contact
        </Link>
      </div>
      {name === "Guest" ? (
        <div>
          <Link
            to="/login"
            className="text-white font-bold bg-green-900 rounded-md p-1"
          >
            Login
          </Link>
        </div>
      ) : (
        <>
          <div>
            <Link to="/profile" className="text-white font-bold p-3">
              {name}
            </Link>
          </div>
          <div>
            <Link
              to="/logout"
              className="text-white font-bold bg-green-900 rounded-md p-1"
            >
              Logout
            </Link>
          </div>
        </>
      )}
      {/* <div>
        <Link to="/profile" className="text-white font-bold p-3">
          {name}
        </Link>
      </div>
      <div>
        <Link
          to="/login"
          className="text-white font-bold bg-green-900 rounded-md p-1"
        >
          Login
        </Link>
      </div> */}
    </nav>
  );
};

export default Navbar;

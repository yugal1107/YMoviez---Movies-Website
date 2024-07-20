import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import { fetchData } from "../../services/fetchData";
import SearchBox from "./SearchBox";
import NavElement from "./NavElement";
import NavButton from "./NavButton";
import axios from "axios";

const Navbar = () => {
  const [name, setName] = useState("Guest");

  const getName = async () => {
    try {
      const nameData = await fetchData(
        `${import.meta.env.VITE_BASE_API_URL}api/navbar`
      );
      setName(nameData.name);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getName();
  }, [name]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}api/user/logout`
      );
      if (response.status === 200) {
        setName("Guest");
        console.log("Logged out successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-green-400 flex justify-between items-center p-2 font-thin text-3xl">
      <div className="flex gap-3 justify-around items-center">
        <NavElement title="Home" link="/" />
        <NavElement title="About Me" link="/" />
        <Dropdown />
        <div>
          <SearchBox />
        </div>
      </div>
      {name === "Guest" ? (
        <NavButton title="Login" link="/login" />
      ) : (
        <>
          <NavElement title={name} link="/" />
          <NavButton title="Logout" link="/logout" logout={handleLogout} />
        </>
      )}
    </nav>
  );
};

export default Navbar;

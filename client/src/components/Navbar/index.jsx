import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import { fetchData } from "../../services/fetchData";
import SearchBox from "./SearchBox";
import NavElement from "./NavElement";
import NavButton from "./NavButton";

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
          <NavButton title="Logout" link="/logout" />
        </>
      )}
    </nav>
  );
};

export default Navbar;

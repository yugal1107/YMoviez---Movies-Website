import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import { fetchData } from "../../services/fetchData";
import SearchBox from "./SearchBox";
import NavElement from "./NavElement";
import NavButton from "./NavButton";
import axios from "axios";
import { Button } from "antd";
import {
  HomeOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";

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
    <nav className="bg-green-400 flex justify-between items-center py-0 px-2 font-thin text-2xl h-14">
      <div className="flex justify-around items-center align-middle p-0 m-0">
        <a href="/" className="px-4">
          <HomeOutlined className="text-white" />
          <NavElement
            title="Home"
            link="/"
            className="hidden md:inline-block"
          />
        </a>
        <a href="https://yugal1107.vercel.app" className="px-4 hover:bg-green-500 rounded-lg">
          <InfoCircleOutlined className="text-white" />
          <NavElement
            title="About Me"            className="hidden md:inline-block"
          />
        </a>
        <Dropdown />
        <div className="px-4 flex">
          <SearchOutlined className="text-white px-1 md:hidden" />
          <SearchBox className="hidden md:flex" />
        </div>
      </div>
      <Button href="/login" type="primary" size="large">
        <span className="text-xl">Login</span>
      </Button>
      {/* {name === "Guest" ? (
        <NavButton title="Login" link="/login" />
      ) : (
        <>
          <NavElement title={name} link="/" />
          <NavButton title="Logout" link="/logout" logout={handleLogout} />
        </>
      )} */}
    </nav>
  );
};

export default Navbar;

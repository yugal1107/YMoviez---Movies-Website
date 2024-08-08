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
import { useAuth } from "../../context/authContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../firebase";

const Navbar = () => {
  const { user } = useAuth();
  console.log(user);

  const handleLogout = () => {
    const auth = getAuth(app);
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("Logged out successfully");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  // const [name, setName] = useState("Guest");
  // if (user.displayName) {
  //   setName(user.displayName);
  // }

  // const getName = async () => {
  //   try {
  //     const nameData = await fetchData(
  //       `${import.meta.env.VITE_BASE_API_URL}api/navbar`
  //     );
  //     setName(nameData.name);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   getName();
  // }, [name]);

  // const handleLogout = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_BASE_API_URL}api/user/logout`
  //     );
  //     if (response.status === 200) {
  //       setName("Guest");
  //       console.log("Logged out successfully");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <nav className="bg-green-400 flex justify-between items-center py-0 px-2 font-thin text-2xl h-14">
      <div className="flex justify-around items-center align-middle p-0 m-0">
        <a href="/" className="px-4 hover:bg-green-500 rounded-lg">
          <HomeOutlined className="text-white" />
          <NavElement
            title="Home"
            link="/"
            className="hidden md:inline-block"
          />
        </a>
        <a
          href="https://yugal1107.vercel.app"
          className="px-4 hover:bg-green-500 rounded-lg"
        >
          <InfoCircleOutlined className="text-white" />
          <NavElement title="About Me" className="hidden md:inline-block" />
        </a>
        <Dropdown />
        <div className="px-4 flex">
          <SearchBox className="lg:flex" />
        </div>
      </div>
      {/* <Button href="/login" type="primary" size="large">
        <span className="text-xl">Login</span>
      </Button> */}
      {/* {name === "Guest" ? (
        <NavButton title="Login" link="/login" />
      ) : (
        <>
          <NavElement title={name} link="/" />
          <NavButton title="Logout" link="/logout" logout={handleLogout} />
        </>
      )} */}
      {user ? (
        <Button type="primary" size="large" onClick={handleLogout}>
          <span className="text-xl">Logout</span>
        </Button>
      ) : (
        <Button href="/login" type="primary" size="large">
          <span className="text-xl">Login</span>
        </Button>
      )}
    </nav>
  );
};

export default Navbar;

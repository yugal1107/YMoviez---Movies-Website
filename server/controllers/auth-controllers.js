import mongoose from "mongoose";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

//Statefull Authentication

// Map to store uids and users
// const idtousermap = new Map(); //not reqiured in stateless authentication
//This storage is disadvantage of statefull authentication which increase the memory usage in server and if server is restart , it will lost the data

// async function getUser(uid) {
//   return idtousermap.get(uid);
// }

// async function setUser(uid, user) {
//   idtousermap.set(uid, user);
// }

//Stateless Authentication

const secretkey = "mysecretkey";

function getUser(token) {
  try {
    const userid = jwt.verify(token, secretkey);
    if (!userid) return null;
    return userid;
  } catch (error) {
    console.log("Error while verifying token:", error.message);
  }
}

function setUser(user) {
  try {
    if (user.toObject) {
      user = user.toObject();
    }
    const token = jwt.sign(user, secretkey);
    return token;
  } catch (error) {
    console.log("Error while signing token:", error.message);
    res.status(500).send("Error while signing token:", error.message);
  }
}

async function createUser(req, res) {
  console.log("DATA IS : ", req.body);
  await User.create({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
  })
    .then(() => {
      console.log("User created successfully");
      res.status(201).send({ msg: "User created successfully" });
    })
    .catch((error) => {
      console.log("Error:", error.message);
      res.status(500).send({ msg: "An error occured while creating user" });
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function login(req, res) {
  User.findOne({
    email: req.body.email,
    password: req.body.password,
  })
    .then((user) => {
      if (user) {
        //Statefull Authentication
        // const userid = uuidv4();
        // setUser(userid, user);
        // res.cookie("uid", userid);
        // console.log("User logged in successfully");
        // return res.redirect("/home");

        // Stateless Authentication
        console.log("User finded successfully", user);
        try {
          const token = setUser(user);
          // return res.json({ token: token });
          return res
            .status(200)
            .cookie("token", token, {
              httpOnly: true,
            })
            .json({ token: token, msg: "User logged in successfully", user });

          // return res.cookie("uid", setUser(user));
        } catch (error) {
          console.log("Error while setting token:", error.message);
          res
            .status(500)
            .json({ error: "Error while setting token:" + error.message });
        }
      } else {
        console.log("Invalid email or password");
        res.json({
          error: "Invalid username or password",
        });
      }
    })
    .catch((error) => {
      console.log("Error occured: ", error.message);
    });
}

function logout(req, res) {
  //Statefull Authentication
  // idtousermap.delete(req.cookies.uid);
  // res.clearCookie("uid");
  // console.log("User logged out successfully");
  // return res.redirect("/user/login");

  // Stateless Authentication
  console.log("User logged out successfully");
  return res.clearCookie("uid");
}

export { createUser, login, getUser, setUser, logout };

import { Input } from "@nextui-org/react";
import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { app } from "../firebase";
import { Button } from "@nextui-org/react";
import { useAuth } from "../context/authContext";
import { Navigate, useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        return updateProfile(auth.currentUser, { displayName: name });
        // console.log(user);
        // ...
      }).then(() => {
        navigate("/login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
        // ..
      });
  };

  console.log(user);

  return (
    <div className="flex h-dvh justify-center items-center bg-cyan-200 p-4 sm:p-8">
  <div className="rounded-2xl flex flex-col bg-white w-full sm:w-2/3 md:w-1/2 lg:w-1/3 shadow-lg">
    <h1 className="text-3xl text-center p-7 rounded-2xl font-bold">
      Register Here
    </h1>
    <form
      action="submit"
      onSubmit={handleSubmit}
      className="flex flex-col p-5 px-6 sm:px-10 gap-6 sm:gap-10"
    >
      <Input
        type="text"
        label="Name"
        placeholder="Enter your name"
        labelPlacement="outside"
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="email"
        label="Email"
        placeholder="you@example.com"
        labelPlacement="outside"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        labelPlacement="outside"
        label="Password"
        placeholder="Enter your password"
        type={"password"}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex flex-col justify-center items-center">
        <Button type="submit" className="bg-cyan-300 px-4 py-2 rounded-lg">
          Submit
        </Button>
      </div>
    </form>
    {error && (
      <p className="text-red-500 text-center bg-red-100 rounded-2xl p-3">
        {error}
      </p>
    )}
  </div>
</div>);
};

export default Register;

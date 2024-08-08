import { useState } from "react";
import React from "react";
import { Input, Button } from "@nextui-org/react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
const provider = new GoogleAuthProvider();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("/");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
      });
  };

  const handleGoogleSignIn = (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        navigate("/");
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <div className="flex h-dvh justify-center items-center bg-green-200 p-4">
      <div className="rounded-2xl flex flex-col bg-white w-full sm:w-2/3 lg:w-1/3 shadow-lg">
        <h1 className="text-3xl text-center p-7 rounded-2xl font-bold">
          Login Here
        </h1>
        <form
          action="submit"
          onSubmit={handleSubmit}
          className="flex flex-col p-5 px-6 sm:px-10 gap-6 sm:gap-10"
        >
          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            labelPlacement="outside"
            onChange={(e) => setEmail(e.target.value)}
            //   startContent={
            //     <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            //   }
          />
          <Input
            labelPlacement="outside"
            label="Password"
            placeholder="Enter your password"
            type={"password"}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <button type="submit" className="btn-primary bg-green-500 rounded-lg p-2">
            Submit
          </button> */}
          <div className="flex flex-col justify-center items-center">
            <Button type="submit" className="bg-green-300 px-2 font-medium">
              Submit
            </Button>
            <p className="text-center"> or </p>
            <Button
              onClick={handleGoogleSignIn}
              className="bg-green-300 w-full font-medium"
            >
              Continue with Google
            </Button>
          </div>
        </form>
        {error && (
          <p className="text-red-500 text-center bg-red-100 rounded-2xl p-3">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;

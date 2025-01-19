import { useState } from "react";
import React from "react";
import { Input, Button } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { app } from "../firebase";

const provider = new GoogleAuthProvider();

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleGoogleSignIn = (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    signInWithPopup(auth, provider)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-2xl shadow-2xl border border-gray-800">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              labelPlacement="outside"
              onChange={(e) => setEmail(e.target.value)}
              classNames={{
                label: "text-gray-400",
                input: "bg-gray-800 text-white border-gray-700",
              }}
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              label="Password"
              placeholder="Create a password"
              labelPlacement="outside"
              onChange={(e) => setPassword(e.target.value)}
              classNames={{
                label: "text-gray-400",
                input: "bg-gray-800 text-white border-gray-700",
              }}
            />
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2"
            >
              Sign Up
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">or</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 flex items-center justify-center gap-2"
            >
              <img className="h-5 w-5" src="/google-icon.png" alt="Google" />
              Continue with Google
            </Button>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-500/50 rounded-lg">
            <p className="text-red-500 text-sm text-center">{error}</p>
          </div>
        )}

        <p className="text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-500 hover:text-pink-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

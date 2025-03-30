import { useState } from "react";
import React from "react";
import { Input, Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
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
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoogleSignIn = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const auth = getAuth(app);
    signInWithPopup(auth, provider)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>

        <div className="relative w-full p-8 bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800 overflow-hidden transition-all duration-300 hover:border-gray-700">
          {/* Shimmering effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/5 to-transparent shimmer"></div>

          <h1 className="text-4xl font-bold text-center text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Sign in to continue your movie journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                type="email"
                label="Email"
                placeholder="you@example.com"
                labelPlacement="outside"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                classNames={{
                  label: "text-gray-400 font-medium mb-1",
                  base: "pb-3",
                  input: "bg-gray-800/70 text-white border-gray-700",
                  inputWrapper:
                    "bg-gray-800/70 border border-gray-700 hover:border-pink-500/50 focus-within:border-pink-500 h-12",
                }}
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-4">
              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                labelPlacement="outside"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                classNames={{
                  label: "text-gray-400 font-medium mb-1",
                  base: "pb-3",
                  input: "bg-gray-800/70 text-white border-gray-700",
                  inputWrapper:
                    "bg-gray-800/70 border border-gray-700 hover:border-pink-500/50 focus-within:border-pink-500 h-12",
                }}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex justify-end">
              <a
                href="#"
                className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <div className="space-y-4 pt-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-pink-600/20"
                isLoading={isLoading}
              >
                Sign In
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">
                    or continue with
                  </span>
                </div>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-600 transition-all duration-300"
                isLoading={isLoading}
              >
                <img className="h-5 w-5" src="/google-icon.png" alt="Google" />
                Google
              </Button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg animate-pulse">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <p className="text-center text-gray-400 mt-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-pink-500 hover:text-pink-400 font-medium transition-colors duration-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

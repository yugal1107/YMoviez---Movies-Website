import { useState } from "react";
import React from "react";
import { Input, Button } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { app } from "../firebase";

const provider = new GoogleAuthProvider();

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoadingEmail(true);
    setError("");

    // Basic password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoadingEmail(false);
      return;
    }

    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Update displayName
        return updateProfile(user, {
          displayName: name,
        }).then(() => {
          // Send verification email
          return sendEmailVerification(user).then(() => {
            // Sign out the user to prevent access until email is verified
            return signOut(auth).then(() => {
              setError("Verification email sent! Please check your inbox and verify your email before logging in.");
              // Optionally redirect to login page
              navigate("/login");
            });
          });
        });
      })
      .catch((error) => {
        // Map Firebase errors to user-friendly messages
        switch (error.code) {
          case "auth/email-already-in-use":
            setError("This email is already in use. Please log in or use a different email.");
            break;
          case "auth/invalid-email":
            setError("Invalid email address. Please check and try again.");
            break;
          case "auth/weak-password":
            setError("Password is too weak. Please use a stronger password.");
            break;
          default:
            setError(error.message);
        }
      })
      .finally(() => {
        setIsLoadingEmail(false);
      });
  };

  const handleGoogleSignIn = (e) => {
    e.preventDefault();
    setIsLoadingGoogle(true);
    setError("");
    const auth = getAuth(app);
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        // Google users typically have verified emails, but check anyway
        if (!user.emailVerified) {
          // Send verification email if email is not verified
          return sendEmailVerification(user).then(() => {
            // Sign out to enforce verification
            return signOut(auth).then(() => {
              setError("Verification email sent! Please check your inbox and verify your email before logging in.");
              navigate("/login");
            });
          });
        } else if (!user.displayName) {
          navigate("/profile-setup"); // Redirect to profile setup if displayName is missing
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/popup-closed-by-user":
            setError("Google sign-in was canceled. Please try again.");
            break;
          default:
            setError(error.message);
        }
      })
      .finally(() => {
        setIsLoadingGoogle(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl"></div>

        <div className="relative w-full p-8 bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800 overflow-hidden transition-all duration-300 hover:border-gray-700">
          {/* Shimmering effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent shimmer"></div>

          <h1 className="text-4xl font-bold text-center text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Join us and discover amazing movies
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                type="text"
                label="Name"
                placeholder="Your name"
                labelPlacement="outside"
                value={name}
                onChange={(e) => setName(e.target.value)}
                classNames={{
                  label: "text-gray-400 font-medium mb-1",
                  base: "pb-3",
                  input: "bg-gray-800/70 text-white border-gray-700",
                  inputWrapper:
                    "bg-gray-800/70 border border-gray-700 hover:border-purple-500/50 focus-within:border-purple-500 h-12",
                }}
                autoComplete="name"
                required
              />
            </div>

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
                    "bg-gray-800/70 border border-gray-700 hover:border-purple-500/50 focus-within:border-purple-500 h-12",
                }}
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-4">
              <Input
                type="password"
                label="Password"
                placeholder="Create a password"
                labelPlacement="outside"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                classNames={{
                  label: "text-gray-400 font-medium mb-1",
                  base: "pb-3",
                  input: "bg-gray-800/70 text-white border-gray-700",
                  inputWrapper:
                    "bg-gray-800/70 border border-gray-700 hover:border-purple-500/50 focus-within:border-purple-500 h-12",
                }}
                autoComplete="new-password"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-purple-600/20"
                isLoading={isLoadingEmail}
              >
                Sign Up
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
                isLoading={isLoadingGoogle}
              >
                <img className="h-5 w-5" src="/google-icon.png" alt="Google" />
                Google
              </Button>
            </div>
          </form>

          {error && (
            <div
              className={`mt-6 p-4 rounded-lg animate-pulse ${
                error.includes("Verification email sent")
                  ? "bg-green-900/30 border border-green-500/50"
                  : "bg-red-900/30 border border-red-500/50"
              }`}
            >
              <p
                className={`text-sm text-center ${
                  error.includes("Verification email sent")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {error}
              </p>
            </div>
          )}

          <p className="text-center text-gray-400 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-500 hover:text-purple-400 font-medium transition-colors duration-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
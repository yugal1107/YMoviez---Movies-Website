import axios from "axios";
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "../components/Notification";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  const userLogin = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      console.log(email, password);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}api/user/login`,
        {
          email: email,
          password: password,
        }
      );
      const user = await res.data;

      if (res.error) {
        console.log("Error : ", res.error);
      } else {
        setNotificationVisible(true);
        navigate("/");
      }

      if (user.error) {
        setError(user.error);
        console.log(user.error);
      }
      setLoading(false);
    } catch (error) {
      setError("Invalid Credentials");
      console.log(error);
    }
  };

  return (
    // <div className="flex-col justify-center align-middle w-2/4 bg-green-100" >
    //     <div className="text-lg">Sign In Here</div>
    //     <form action=""></form>
    // </div>

    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" method="POST" onSubmit={userLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                {/* <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div> */}
              </div>
              <div className="mt-2">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="/register"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Register Here
            </a>
          </p>
        </div>
      </div>
      <Notification
        message="Logged in successfully!"
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />
    </>
  );
};

export default Login;

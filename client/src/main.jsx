import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./context/authContext.jsx";
import { NextUIProvider } from "@nextui-org/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextUIProvider>
      <UserProvider>
        <main className="dark text-foreground bg-background">
          <App />
        </main>
      </UserProvider>
    </NextUIProvider>
  </React.StrictMode>
);

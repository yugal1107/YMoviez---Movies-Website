import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./context/authContext.jsx";
import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        <UserProvider>
          <main className="dark text-foreground bg-background">
            <App />
          </main>
        </UserProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

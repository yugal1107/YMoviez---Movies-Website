import React from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-white/10 transition-colors"
    >
      {theme === "dark" ? (
        <SunIcon className="h-5 w-5 text-gray-300 hover:text-white" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-700 hover:text-gray-900" />
      )}
    </button>
  );
};

export default ThemeSwitch;

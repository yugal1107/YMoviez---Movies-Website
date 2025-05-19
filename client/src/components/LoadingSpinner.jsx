import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Loader2 className="h-12 w-12 animate-spin text-pink-500 dark:text-pink-400" />
    </div>
  );
};

export default LoadingSpinner;

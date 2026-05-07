import React from "react";

const Pulse = ({ className }) => (
  <div className={`animate-pulse rounded-md bg-gray-700 ${className}`} />
);

const MovieSkeleton = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero — mirrors the 60vh backdrop section */}
      <div className="relative h-[60vh] w-full bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="container mx-auto absolute bottom-0 left-0 right-0 p-4 md:p-8 flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <Pulse className="hidden md:block w-64 h-96 flex-shrink-0 translate-y-16" />

          {/* Title + meta + buttons */}
          <div className="flex-1 self-end space-y-3 pb-2">
            <Pulse className="h-9 w-3/4" />
            <div className="flex gap-4">
              <Pulse className="h-5 w-16" />
              <Pulse className="h-5 w-24" />
              <Pulse className="h-5 w-20" />
            </div>
            <Pulse className="h-4 w-full" />
            <Pulse className="h-4 w-5/6" />
            <Pulse className="h-4 w-4/6" />
            <div className="flex gap-2 pt-1">
              <Pulse className="h-9 w-20 rounded-full" />
              <Pulse className="h-9 w-24 rounded-full" />
              <Pulse className="h-9 w-24 rounded-full" />
              <Pulse className="h-9 w-32 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="container mx-auto px-2 sm:px-4 py-6 md:py-16 space-y-8 md:space-y-16">
        {/* Genres + Production Companies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div className="space-y-4">
            <Pulse className="h-6 w-20" />
            <div className="flex flex-wrap gap-2">
              {[80, 64, 96, 72].map((w, i) => (
                <Pulse key={i} className={`h-7 w-${w / 4} rounded-full`} style={{ width: w }} />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Pulse className="h-6 w-48" />
            <div className="flex flex-wrap gap-2">
              {[120, 88, 104].map((w, i) => (
                <Pulse key={i} className="h-7 rounded-full" style={{ width: w }} />
              ))}
            </div>
          </div>
        </div>

        {/* Cast row */}
        <div className="space-y-4">
          <Pulse className="h-6 w-16" />
          <div className="flex gap-4 overflow-hidden pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-28 sm:w-36 md:w-44 rounded-lg overflow-hidden">
                <Pulse className="w-full aspect-[2/3]" />
                <div className="p-4 space-y-2 bg-gray-900">
                  <Pulse className="h-4 w-full" />
                  <Pulse className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations row */}
        <div className="space-y-4">
          <Pulse className="h-6 w-48" />
          <div className="flex gap-6 overflow-hidden pb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Pulse key={i} className="flex-shrink-0 w-32 md:w-52 aspect-[2/3] rounded-lg" />
            ))}
          </div>
        </div>

        {/* Rating section */}
        <div className="space-y-4">
          <Pulse className="h-6 w-32" />
          <div className="flex gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Pulse key={i} className="h-8 w-8 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieSkeleton;

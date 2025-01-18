import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const GenresDropdown = () => {
  const navigate = useNavigate();

  const handleSelect = (genreId) => {
    navigate(`/genre/${genreId}`);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          className="text-gray-300 hover:text-white flex items-center gap-1"
          endContent={<ChevronDownIcon className="h-4 w-4" />}
        >
          Categories
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Movie genres"
        className="bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl"
        items={genres}
      >
        {(genre) => (
          <DropdownItem
            key={genre.id}
            className="text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => handleSelect(genre.id)}
          >
            {genre.name}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default GenresDropdown;
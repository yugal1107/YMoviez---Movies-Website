import React from "react";
import { useNavigate } from "react-router-dom";

const NavButton = (props) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(props.link);
  };

  return (
    <div>
      <button
        onClick={props.logout || handleClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {props.title}
      </button>
    </div>
  );
};

export default NavButton;

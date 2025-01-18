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
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
      >
        {props.title}
      </button>
    </div>
  );
};

export default NavButton;

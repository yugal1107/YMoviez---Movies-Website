import React from "react";

/**
 * Reusable scroll button component for horizontal scrolling
 * Styled similar to the Carousel.jsx navigation buttons
 *
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Function to call when button is clicked
 * @param {React.ReactNode} props.icon - Icon to display in button
 * @param {'left'|'right'} props.direction - Which direction the button scrolls
 * @param {string} props.className - Additional classes to apply
 */
const ScrollButton = ({ onClick, icon, direction, className = "" }) => {
  // Default positioning based on direction
  const positionClass =
    direction === "left" ? "-left-3 lg:-left-5" : "-right-3 lg:-right-5";

  return (
    <button
      onClick={onClick}
      className={`
        hidden lg:block absolute ${positionClass} top-1/2 -translate-y-1/2 z-10 
        bg-black/30 hover:bg-black/50 text-white p-1 md:p-2 
        rounded-full transition-colors 
        ${className}
      `}
      aria-label={`Scroll ${direction}`}
    >
      {icon}
    </button>
  );
};

export default ScrollButton;

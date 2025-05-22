import React, { useState, useRef, useEffect } from "react";

/**
 * A reusable dropdown menu component
 * @param {Object} props
 * @param {React.ReactNode} props.trigger - The element that triggers the dropdown
 * @param {Array} props.items - Array of menu items with label, icon, onClick, and className
 * @param {string} props.align - Alignment of dropdown menu ('left', 'right')
 * @param {string} props.className - Additional class names for the dropdown menu
 */
const DropdownMenu = ({
  trigger,
  items,
  align = "right",
  className = "",
  width = "w-48",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle ESC key to close dropdown
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => document.removeEventListener("keydown", handleEscKey);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger element */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`absolute ${
            align === "left" ? "left-0" : "right-0"
          } mt-2 ${width} rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 animate-in fade-in slide-in-from-top-5 duration-200 ${className}`}
        >
          <div
            className="py-1 rounded-md overflow-hidden"
            role="menu"
            aria-orientation="vertical"
          >
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                  item.className ||
                  "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                role="menuitem"
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;

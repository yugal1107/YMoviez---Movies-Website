import React, { useEffect } from 'react';

const Notification = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div
      className={`fixed top-20 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg transition-transform ${
        visible ? 'transform translate-x-0' : 'transform translate-x-full'
      }`}
    >
      {message}
    </div>
  );
};

export default Notification;

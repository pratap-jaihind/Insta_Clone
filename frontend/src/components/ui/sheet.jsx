import React from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

const Sheet = ({ open, onClose, children }) => {
  if (!open) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={onClose}
      />

      {/* Sidebar content */}
      <div className="fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg p-4 animate-slide-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">LOGO</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </>,
    document.body
  );
};

export default Sheet;

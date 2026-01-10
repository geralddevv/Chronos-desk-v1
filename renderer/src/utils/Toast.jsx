import { useEffect } from "react";

export default function Toast({ message, show, onClose }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [show, onClose]);

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 
        px-4 py-2 rounded-md text-sm text-white
        bg-nero-700 border border-nero-500 shadow-lg
        transition-all duration-300
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
    >
      {message}
    </div>
  );
}

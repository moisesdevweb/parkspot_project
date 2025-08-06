import React from "react";

export default function Button({
  children,
  color = "primary",
  type = "button", // por defecto es button
  className = "",
  ...props
}) {
  const base =
    "px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow focus:outline-none";
  const styles =
    color === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95";

  return (
    <button type={type} className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
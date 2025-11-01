"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data: string; // texto del botón
}

export default function Buttons({
  data,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`bg-[#dff400] text-black font-semibold px-4 py-2 rounded-lg hover:bg-[#cbe000] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {data}
    </button>
  );
}

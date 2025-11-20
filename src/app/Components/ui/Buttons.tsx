"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data: string;
  children?: React.ReactNode;
}

export default function Buttons({ data, children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`bg-[#dff400] text-black font-semibold  rounded-lg hover:bg-[#cbe000] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
      {data}
    </button>
  );
}

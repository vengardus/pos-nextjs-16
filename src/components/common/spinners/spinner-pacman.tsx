"use client";

import { PacmanLoader } from "react-spinners";

interface SpinnerPacmanProps {
  size?: number;
  className?: string;
}

export const SpinnerPacman = ({
  size = 30,
  className = "w-full h-screen",
}: SpinnerPacmanProps) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <PacmanLoader color="#36d7b7" size={size} speedMultiplier={2} />
    </div>
  );
};

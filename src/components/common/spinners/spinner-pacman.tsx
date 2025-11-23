"use client"
import { PacmanLoader } from 'react-spinners';

export const SpinnerPacman = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <PacmanLoader color="#36d7b7" size={30} speedMultiplier={2} />
    </div>
  );
};


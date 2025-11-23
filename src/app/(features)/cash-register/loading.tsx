// src/app/(features)/config/loading.tsx

import { SpinnerPacman } from "@/components/common/spinners/spinner-pacman";



export default function LoadingPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SpinnerPacman />
    </div>
  );
}

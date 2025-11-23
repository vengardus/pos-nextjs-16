"use client";

import { useUserStore } from "@/stores/user/user.store";

export const PosUser= () => {
  const currentUser = useUserStore((state) => state.currentUser);
  return (
      <div className="flex flex-col">
        <span className="font-bold">{currentUser?.userName}</span>
        <span className="text-sm">{currentUser?.role}</span>
      </div>
  );
};

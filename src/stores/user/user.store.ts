import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/interfaces/user/user.interface";

interface CurrentUser {
    id: string;
    userName: string;
    role: string;
}

interface State {
  currentUser: CurrentUser;
  setCurrentUser: (currentUser: CurrentUser) => void;
  user: User;
  setUser: (user: User) => void;
}

export const useUserStore = create<State>()(
  persist(
    (set) => ({
      currentUser: {} as CurrentUser,      //clientsSuppliers: respClientSupplier.data,,
      user: {} as User,

      setCurrentUser(currentUser: CurrentUser) {
        set({ currentUser });
      },
      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: "user-store",
    }
  )
);

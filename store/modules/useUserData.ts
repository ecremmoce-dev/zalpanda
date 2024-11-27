import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface IUserDataState {
  user: IUserData | null;
  setUserData: (user: IUserData) => void;
}

interface IUserData {
  companyid: string
}

const NAME = 'userDataStore';
export const useUserDataStore = create<IUserDataState>()(
  devtools(
    (set) => ({
      user: null,
      setUserData: (user: IUserData) => set({ user }),
    }),
    { name: NAME },
  ),
);
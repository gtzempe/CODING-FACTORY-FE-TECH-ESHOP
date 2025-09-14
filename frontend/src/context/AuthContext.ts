import {createContext} from "react";
import type {DecodedToken} from "@/providers/AuthProvider.tsx";

type AuthContextProps = {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: DecodedToken | null;
  loginUser: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextProps | undefined>(
    undefined,
);

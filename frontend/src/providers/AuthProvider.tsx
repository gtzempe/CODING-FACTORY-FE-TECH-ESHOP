import {type ReactNode, useEffect, useState} from "react";
import {getCookie, removeCookie, setCookie} from "@/utils/cookie.ts";
import {jwtDecode} from "jwt-decode"
import {login} from "@/api/login.ts";
import {AuthContext} from "../context/AuthContext.ts";
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";


export type DecodedToken = {
  _id: string;
  username: string;
  email: string;
  roles: string[];
  expires: number;
}

export const AuthProvider = ({children}: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const token = getCookie("access-token");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setAccessToken(token)
        setUser(decoded)
      } catch (err) {
        console.error("Invalid Token:", err);
        removeCookie("access-token");
      }
    }
    setLoading(false);
  }, []);

  const loginUser = async (username: string, password: string) => {
    try {
      setLoading(true);
      const result = await login({username, password});
      const token = result.data

      setCookie("access-token", token, {expires: 1})

      const decoded = jwtDecode<DecodedToken>(token);
      setAccessToken(token)
      setUser(decoded)
    } catch (err) {
      console.error("Invalid Token:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  const logout = () => {
    removeCookie("access-token");
    setAccessToken(null);
    setUser(null);
    toast.success("You have been logged out.");
    navigate("/");
  };

  return (
      <>
        <AuthContext.Provider value={{
          isAuthenticated: !!accessToken,
          accessToken,
          user,
          loginUser,
          logout,
          loading,
        }}>
          {children}
        </AuthContext.Provider>
      </>
  )
};

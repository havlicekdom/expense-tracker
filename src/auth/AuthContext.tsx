import React, { useMemo, useState } from "react";
import * as api from "./api";
import type { User } from "../types";

type LoginUserFunction = (email: string) => void;
type LogoutUserFunction = () => void;

type InitialState = {
  user: User | null;
  loginUser: LoginUserFunction;
  logoutUser: LogoutUserFunction;
};

const initialState: InitialState = {
  user: null,
  loginUser: () => ({}),
  logoutUser: () => ({}),
};

const AuthContext = React.createContext(initialState);

AuthContext.displayName = "AuthContext";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string)
      : null
  );

  const authContextValues = useMemo(() => {
    const loginUser: LoginUserFunction = (email) => {
      setUser(api.loginUser(email));
    };

    const logoutUser: LogoutUserFunction = () => {
      setUser(null);
      api.logoutUser();
    };

    return {
      user,
      loginUser,
      logoutUser,
    };
  }, [user]);

  return (
    <AuthContext.Provider value={authContextValues}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };

import React, { useEffect, useState, createContext } from "react";
import { auth } from "../firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(setUser);
    sessionStorage.setItem("loginLoading", "false");
  }, []);

  return (
    <AuthContext.Provider value={{ user, auth }}>
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useState, useEffect } from "react";
import { getMe, logOut as logOutRequest } from "../services/api";

export const AuthContext = createContext(null);

export function getInitials(name) {
  if (!name) {
    return "";
  }
  const parts = name.trim().split(" ");
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getMe();
        setUser(data.user || null);
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  async function logOut() {
    try {
      await logOutRequest();
    } catch (error) {
      console.log(error.message);
    }
    setUser(null);
  }

  const isAdmin = Boolean(user && user.role === "admin");

  return (
    <AuthContext.Provider value={{ user, setUser, loading, isAdmin, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

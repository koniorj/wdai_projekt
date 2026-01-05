import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../api/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const stored = authService.getAuth();
    if (stored) {
      if (authService.isTokenValid(stored.accessToken)) {
        setAuth(stored);
      } else {
        const refreshed = authService.refreshAccessToken();
        setAuth(refreshed);
      }
    }
  }, []);

  const login = (login, password) => {
    const data = authService.loginUser(login, password);
    if (data) {
      setAuth(data);
      return true;
    }
    return false;
  };

  const register = (login, password) => {
    return authService.registerUser(login, password);
  };

  const logout = () => {
    authService.logoutUser();
    setAuth(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth?.user,
        isLoggedIn: !!auth,
        role: auth?.user?.role,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

/**
 * AuthContext — Redux-backed compatibility layer.
 *
 * All components continue to use `useAuth()` exactly as before.
 * Internally, state is managed by Redux (authSlice) so it benefits
 * from the Redux DevTools, centralized store, and predictable updates.
 */
import { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginSuccess,
  logoutUser,
  selectUser,
  selectToken,
} from "../store/authSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  /** Login: dispatch to Redux store (also persists to localStorage via slice) */
  const login = (userData, authToken) => {
    dispatch(loginSuccess({ user: userData, token: authToken }));
  };

  /** Logout: dispatch to Redux store (also clears localStorage via slice) */
  const logout = () => {
    dispatch(logoutUser());
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth — same API as before.
 * Returns { user, token, login, logout }
 */
export const useAuth = () => useContext(AuthContext);
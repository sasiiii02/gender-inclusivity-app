import { createSlice } from "@reduxjs/toolkit";

// Load persisted state from localStorage on startup
const persistedUser = JSON.parse(localStorage.getItem("user")) || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: persistedUser,
    token: localStorage.getItem("token") || null,
  },
  reducers: {
    /**
     * Called after successful login or register.
     * Persists user and token to localStorage.
     */
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },

    /**
     * Clears auth state and localStorage on logout.
     */
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear();
    },

    /**
     * Updates just the user object (e.g., after a profile update).
     */
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { loginSuccess, logoutUser, updateUser } = authSlice.actions;

// Selectors — components use these to read from the store
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => !!state.auth.user;

export default authSlice.reducer;

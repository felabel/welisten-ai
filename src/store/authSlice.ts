import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of our auth state
interface AuthState {
  user: any | null;
  token: string | null;
  userName: string | null;
  isLoggedIn: boolean;
  fullUser: any | null;
  userId: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  userName: null,
  isLoggedIn: false,
  fullUser: null,
  userId: null,
};

// Create slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.token = action.payload;
      state.userName = action.payload;
      state.fullUser = action.payload;
      state.userId = action.payload?.id || null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;
      state.userName = null;
      state.fullUser = null;
      state.isLoggedIn = false;
      window.localStorage.clear();
      window.location.href = "/login";
    },
  },
});

// Export actions
export const { setUser, setToken, logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;

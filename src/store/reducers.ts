import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Your regular auth slice
import { authApi } from "../services/authApi"; // Import authApi reducer from RTK Query
import { protectedApi } from "../services/protectedApi";

const rootReducer = combineReducers({
  //Shared Reducers
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [protectedApi.reducerPath]: protectedApi.reducer,
});

export default rootReducer;

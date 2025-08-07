import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ApiResponse } from "../../models/apiResponse";
import {
  renewAccessThunk,
  signInThunk,
  signOutThunk,
  signUpThunk,
} from "../thunks/authThunks";

interface AuthState {
  accessToken: string | null;
  renewToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  response: ApiResponse | null;
}

const initialState: AuthState = {
  accessToken: null,
  renewToken: null,
  isAuthenticated: false,
  loading: false,
  response: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthResponse: (state) => {
      state.response = null;
    },
    logoutLocal: (state) => {
      state.accessToken = null;
      state.renewToken = null;
      state.isAuthenticated = false;
      state.response = null;
    },
  },
  extraReducers: (builder) => {
    // Sign In
    builder.addCase(signInThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      signInThunk.fulfilled,
      (
        state,
        action: PayloadAction<{
          accessToken: string;
          renewToken: string;
          response: ApiResponse;
        }>
      ) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.renewToken = action.payload.renewToken;
        state.isAuthenticated = true;
        state.response = action.payload.response;
      }
    );
    builder.addCase(signInThunk.rejected, (state, action) => {
      state.loading = false;
      state.response = action.payload ?? null;
    });

    // Sign Up
    builder.addCase(signUpThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      signUpThunk.fulfilled,
      (
        state,
        action: PayloadAction<{
          accessToken: string;
          renewToken: string;
          response: ApiResponse;
        }>
      ) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.renewToken = action.payload.renewToken;
        state.isAuthenticated = true;
        state.response = action.payload.response;
      }
    );
    builder.addCase(signUpThunk.rejected, (state, action) => {
      state.loading = false;
      state.response = action.payload ?? null;
    });

    // Sign Out
    builder.addCase(signOutThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      signOutThunk.fulfilled,
      (state, action: PayloadAction<ApiResponse>) => {
        state.loading = false;
        state.accessToken = null;
        state.renewToken = null;
        state.isAuthenticated = false;
        state.response = action.payload;
      }
    );
    builder.addCase(signOutThunk.rejected, (state, action) => {
      state.loading = false;
      state.response = action.payload ?? null;
    });

    // Renew Access Token
    builder.addCase(renewAccessThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      renewAccessThunk.fulfilled,
      (state, action: PayloadAction<{ accessToken: string }>) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      }
    );
    builder.addCase(renewAccessThunk.rejected, (state, action) => {
      state.loading = false;
      state.response = action.payload ?? null;
    });
  },
});

export const { clearAuthResponse, logoutLocal } = authSlice.actions;
export default authSlice.reducer;

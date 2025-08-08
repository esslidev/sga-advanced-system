import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ApiResponse } from "../../models/apiResponse";
import {
  renewAccessThunk,
  signInThunk,
  signOutThunk,
  signUpThunk,
} from "../thunks/authThunks";
import type { ApiAuth } from "../../models/apiAuth";

interface AuthState {
  apiAuth: ApiAuth | null;
  loading: boolean;
  response: ApiResponse | null;
}

const initialState: AuthState = {
  apiAuth: null,
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
      state.apiAuth = null;
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
        action: PayloadAction<{ auth: ApiAuth; response: ApiResponse }>
      ) => {
        state.loading = false;
        state.apiAuth = action.payload.auth;
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
        action: PayloadAction<{ auth: ApiAuth; response: ApiResponse }>
      ) => {
        state.loading = false;
        state.apiAuth = action.payload.auth;
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
      (state, action: PayloadAction<{ response: ApiResponse }>) => {
        state.loading = false;
        state.apiAuth = null;
        state.response = action.payload.response;
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
      (
        state,
        action: PayloadAction<{ newAccessToken: string; response: ApiResponse }>
      ) => {
        state.loading = false;
        if (state.apiAuth) {
          state.apiAuth.accessToken = action.payload.newAccessToken;
        }
        state.response = action.payload.response;
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

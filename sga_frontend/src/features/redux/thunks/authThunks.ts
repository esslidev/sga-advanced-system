import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../core/services/api";
import type { ApiResponse } from "../../models/apiResponse";
import type { ApiAuth } from "../../models/apiAuth";
import { authRequestHandler } from "../../../core/utils/apiUtil";
import type { AppDispatch, RootState } from "../store";

// ---------- Types ----------
type SignInPayload = {
  CIN: string;
  password: string;
};

type SignUpPayload = {
  adminAccessCode: string;
  CIN: string;
  password: string;
  firstName: string;
  lastName: string;
};

type RenewPayload = {
  expiredAccessToken: string;
  renewToken: string;
};

// ---------- SIGN IN ----------
export const signInThunk = createAsyncThunk<
  { response: ApiResponse; auth: ApiAuth },
  SignInPayload,
  { rejectValue: ApiResponse; state: RootState }
>("auth/signIn", async (payload, thunkAPI) => {
  const { getState, rejectWithValue } = thunkAPI;
  try {
    const res = await api.post("/auth/sign-in", payload, {
      headers: { language: getState().systemPreferences.language },
    });

    return {
      response: res.data.response,
      auth: res.data.auth,
    };
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data?.response || {
      statusCode: 500,
      title: "Unknown Error",
      message: err.message,
    };
    return rejectWithValue(errorResponse);
  }
});

// ---------- SIGN UP ----------
export const signUpThunk = createAsyncThunk<
  { response: ApiResponse; auth: ApiAuth },
  SignUpPayload,
  { rejectValue: ApiResponse; state: RootState }
>("auth/signUp", async (payload, thunkAPI) => {
  const { getState, rejectWithValue } = thunkAPI;
  try {
    const res = await api.post("/auth/sign-up", payload, {
      headers: { language: getState().systemPreferences.language },
    });

    return {
      response: res.data.response,
      auth: res.data.auth,
    };
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data?.response || {
      statusCode: 500,
      title: "Unknown Error",
      message: err.message,
    };
    return rejectWithValue(errorResponse);
  }
});

// ---------- SIGN OUT ----------
export const signOutThunk = createAsyncThunk<
  ApiResponse,
  void,
  { rejectValue: ApiResponse; dispatch: AppDispatch; state: RootState }
>("auth/signOut", async (_, thunkAPI) => {
  const { dispatch, getState, rejectWithValue } = thunkAPI;
  try {
    const result = await authRequestHandler(
      async (accessToken) => {
        const res = await api.post(
          "/auth/sign-out",
          {},
          {
            headers: {
              authorization: accessToken,
              language: getState().systemPreferences.language,
            },
          }
        );
        return res.data.response;
      },
      dispatch,
      getState()
    );
    return result;
  } catch (error) {
    const apiError = error as ApiResponse;
    return rejectWithValue(apiError);
  }
});

// ---------- RENEW ACCESS ----------
export const renewAccessThunk = createAsyncThunk<
  { newAccessToken: string; response: ApiResponse },
  RenewPayload,
  { rejectValue: ApiResponse; state: RootState }
>("auth/access/renew", async ({ expiredAccessToken, renewToken }, thunkAPI) => {
  const { getState, rejectWithValue } = thunkAPI;
  try {
    const res = await api.post(
      "/auth/access/renew",
      {
        expiredAccessToken,
        renewToken,
      },
      {
        headers: { language: getState().systemPreferences.language },
      }
    );

    return {
      newAccessToken: res.data.auth.newAccessToken,
      response: res.data.response,
    };
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data?.response || {
      statusCode: 500,
      title: "Unknown Error",
      message: err.message,
    };
    return rejectWithValue(errorResponse);
  }
});

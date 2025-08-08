import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../core/services/api";
import type { ApiResponse } from "../../models/apiResponse";
import type { ApiAuth } from "../../models/apiAuth";

// ---------- Types ----------
interface SignInPayload {
  CIN: string;
  password: string;
}

interface SignUpPayload {
  adminAccessCode: string;
  CIN: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface RenewPayload {
  renewToken: string;
}

// ---------- SIGN IN ----------
export const signInThunk = createAsyncThunk<
  { response: ApiResponse; auth: ApiAuth },
  SignInPayload,
  { rejectValue: ApiResponse }
>("auth/signIn", async (payload, thunkAPI) => {
  try {
    const res = await api.post("/auth/sign-in", payload);

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
    return thunkAPI.rejectWithValue(errorResponse);
  }
});

// ---------- SIGN UP ----------
export const signUpThunk = createAsyncThunk<
  { response: ApiResponse; auth: ApiAuth },
  SignUpPayload,
  { rejectValue: ApiResponse }
>("auth/signUp", async (payload, thunkAPI) => {
  try {
    const res = await api.post("/auth/sign-up", payload);

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
    return thunkAPI.rejectWithValue(errorResponse);
  }
});

// ---------- SIGN OUT ----------
export const signOutThunk = createAsyncThunk<
  { response: ApiResponse },
  void,
  { rejectValue: ApiResponse }
>("auth/signOut", async (_, thunkAPI) => {
  try {
    const res = await api.post("/auth/sign-out");

    return {
      response: res.data.response,
    };
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data?.response || {
      statusCode: 500,
      title: "Unknown Error",
      message: err.message,
    };
    return thunkAPI.rejectWithValue(errorResponse);
  }
});

// ---------- RENEW ACCESS ----------
export const renewAccessThunk = createAsyncThunk<
  { newAccessToken: string; response: ApiResponse },
  RenewPayload,
  { rejectValue: ApiResponse }
>("auth/renewAccess", async (renewToken, thunkAPI) => {
  try {
    const res = await api.post("/auth/renew", { renewToken });

    return {
      newAccessToken: res.data.auth.accessToken,
      response: res.data.response,
    };
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data?.response || {
      statusCode: 500,
      title: "Unknown Error",
      message: err.message,
    };
    return thunkAPI.rejectWithValue(errorResponse);
  }
});

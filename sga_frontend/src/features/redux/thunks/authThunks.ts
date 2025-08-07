import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../core/services/api";
import type { ApiResponse } from "../../models/apiResponse";

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

interface AuthResponse {
  accessToken: string;
  renewToken: string;
  response: ApiResponse;
}

interface RenewResponse {
  accessToken: string;
}

// ---------- SIGN IN ----------
export const signInThunk = createAsyncThunk<
  AuthResponse,
  SignInPayload,
  { rejectValue: ApiResponse }
>("auth/signIn", async (payload, thunkAPI) => {
  try {
    const res = await api.post("/auth/sign-in", payload);
    return res.data;
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data || {
      statusCode: 500,
      title: "Unknown Error",
      message: err.message,
    };
    return thunkAPI.rejectWithValue(errorResponse);
  }
});

// ---------- SIGN UP ----------
export const signUpThunk = createAsyncThunk<
  AuthResponse,
  SignUpPayload,
  { rejectValue: ApiResponse }
>("auth/signUp", async (payload, thunkAPI) => {
  try {
    const res = await api.post("/auth/sign-up", payload);
    return res.data;
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data || {
      statusCode: 500,
      title: "Unknown Error",
      message: err.message,
    };
    return thunkAPI.rejectWithValue(errorResponse);
  }
});

// ---------- SIGN OUT ----------
export const signOutThunk = createAsyncThunk<
  ApiResponse,
  void,
  { rejectValue: ApiResponse }
>("auth/signOut", async (_, thunkAPI) => {
  try {
    const res = await api.post("/auth/sign-out");
    return res.data.response;
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data || {
      statusCode: 500,
      title: "Unknown Error",
      message: err.message,
    };
    return thunkAPI.rejectWithValue(errorResponse);
  }
});

// ---------- RENEW ACCESS ----------
export const renewAccessThunk = createAsyncThunk<
  RenewResponse,
  string, // renewToken
  { rejectValue: ApiResponse }
>("auth/renewAccess", async (renewToken, thunkAPI) => {
  try {
    const res = await api.post("/auth/renew", { renewToken });
    return res.data.auth;
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data || {
      statusCode: 500,
      title: "Unknown Error",
      message: err.message,
    };
    return thunkAPI.rejectWithValue(errorResponse);
  }
});

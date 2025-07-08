import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../core/services/api";
import { Visitor } from "../../models/visitor";
import { ApiResponse } from "../../models/apiResponse";

// GET visitor
export const getVisitor = createAsyncThunk<
  Visitor,
  string,
  { rejectValue: ApiResponse }
>("visitor/getVisitor", async (id, thunkAPI) => {
  try {
    const res = await api.get(`/visitor/get-visitor/${id}`);
    return res.data;
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data || {
      statusCode: 500,
      title: "",
      message: err.message,
    };
    return thunkAPI.rejectWithValue(errorResponse);
  }
});

// GET many visitors
export const getVisitors = createAsyncThunk<
  Visitor[],
  string | undefined,
  { rejectValue: ApiResponse }
>("/visitor/getVisitors", async (search, thunkAPI) => {
  try {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await api.get(`/visitor/get-visitors${query}`);
    return res.data;
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data || {
      statusCode: 500,
      title: "",
      message: err.message,
    };
    return thunkAPI.rejectWithValue(errorResponse);
  }
});

// ADD new visitor
export const addVisitor = createAsyncThunk<
  ApiResponse,
  Partial<Visitor>,
  { rejectValue: ApiResponse }
>("visitor/addVisitor", async (newVisitor, thunkAPI) => {
  try {
    const res = await api.post("/visitor/add-visitor", newVisitor);
    return res.data;
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data || {
      statusCode: 500,
      title: "",
      message: err.message,
    };
    return thunkAPI.rejectWithValue(errorResponse);
  }
});

// UPDATE visitor
export const updateVisitor = createAsyncThunk<
  ApiResponse,
  Partial<Visitor>,
  { rejectValue: ApiResponse }
>("visitor/updateVisitor", async (updatedVisitor, thunkAPI) => {
  try {
    const res = await api.put(`/visitor/update-visitor`, updatedVisitor);
    return res.data;
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data || {
      statusCode: 500,
      title: "",
      message: err.message,
    };
    return thunkAPI.rejectWithValue(errorResponse);
  }
});

// DELETE visitor
export const deleteVisitor = createAsyncThunk<
  ApiResponse,
  string,
  { rejectValue: ApiResponse }
>("visitor/deleteVisitor", async (id, thunkAPI) => {
  try {
    const res = await api.delete(`/visitor/delete-visitor/${id}`);
    return res.data;
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data || {
      statusCode: 500,
      title: "",
      message: err.message,
    };
    return thunkAPI.rejectWithValue(errorResponse);
  }
});

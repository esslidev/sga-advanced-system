import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../core/services/api";
import { Visit } from "../../models/visit";
import { ApiResponse } from "../../models/apiResponse";

// GET many visits
export const getVisits = createAsyncThunk<
  Visit[],
  string | undefined,
  { rejectValue: ApiResponse }
>("visit/getVisits", async (visitorId, thunkAPI) => {
  try {
    const query = visitorId
      ? `?visitorId=${encodeURIComponent(visitorId)}`
      : "";
    const res = await api.get(`/visit/get-visits${query}`);
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

// ADD new visit
export const addVisit = createAsyncThunk<
  ApiResponse,
  Partial<Visit>,
  { rejectValue: ApiResponse }
>("visit/addVisit", async (newVisit, thunkAPI) => {
  try {
    const res = await api.post("/visit/add-visit", newVisit);
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

// UPDATE visit
export const updateVisit = createAsyncThunk<
  ApiResponse,
  Partial<Visit>,
  { rejectValue: ApiResponse }
>("visit/updateVisit", async (updatedVisit, thunkAPI) => {
  try {
    const res = await api.put("/visit/update-visit", updatedVisit);
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

// DELETE visit
export const deleteVisit = createAsyncThunk<
  ApiResponse,
  string,
  { rejectValue: ApiResponse }
>("visit/deleteVisit", async (id, thunkAPI) => {
  try {
    const res = await api.delete(`/visit/delete-visit/${id}`);
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

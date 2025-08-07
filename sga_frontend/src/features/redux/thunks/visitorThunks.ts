import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../core/services/api";
import type { Visitor } from "../../models/visitor";
import type { ApiResponse } from "../../models/apiResponse";
import type { ApiPagination } from "../../models/apiPagination";

// GET visitor
export const getVisitor = createAsyncThunk<
  Visitor,
  string,
  { rejectValue: ApiResponse }
>("visitor/getVisitor", async (id, thunkAPI) => {
  try {
    const res = await api.get(`/visitor/get-visitor/${id}`);
    return res.data.data;
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data || {
      statusCode: 500,
      title: "",
      message: err.message,
    };
    return thunkAPI.rejectWithValue(errorResponse);
  }
});

type GetVisitorsQuery = {
  search?: string;
  orderByName?: boolean;
  limit?: number;
  page?: number;
};

// GET many visitors
export const getVisitors = createAsyncThunk<
  { data: Visitor[]; pagination: ApiPagination },
  GetVisitorsQuery | undefined,
  { rejectValue: ApiResponse }
>("/visitor/getVisitors", async (params, thunkAPI) => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append("search", params.search);
    if (params?.orderByName !== undefined)
      queryParams.append("orderByName", String(params.orderByName));
    if (params?.limit !== undefined)
      queryParams.append("limit", String(params.limit));
    if (params?.page !== undefined)
      queryParams.append("page", String(params.page));

    const query = queryParams.toString();
    const res = await api.get(
      `/visitor/get-visitors${query ? "?" + query : ""}`
    );

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
    const res = await api.delete(`/visitor/delete-visitor?id=${id}`);
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

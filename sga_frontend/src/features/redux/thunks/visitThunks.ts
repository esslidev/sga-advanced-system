import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../core/services/api";
import type { Visit } from "../../models/visit";
import type { ApiResponse } from "../../models/apiResponse";
import type { ApiPagination } from "../../models/apiPagination";
import { authRequestHandler } from "../../../core/utils/apiUtil";
import type { AppDispatch, RootState } from "../store";

type GetVisitsQuery = {
  visitorId: string;
  limit?: number;
  page?: number;
};

// GET many visits
export const getVisits = createAsyncThunk<
  { data: Visit[]; pagination: ApiPagination },
  GetVisitsQuery | undefined,
  { rejectValue: ApiResponse; dispatch: AppDispatch; state: RootState }
>("visit/getVisits", async (params, thunkAPI) => {
  try {
    // Use the authRequestHandler to wrap the API call
    const data = await authRequestHandler(
      async (accessToken) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.visitorId)
            queryParams.append("visitorId", params.visitorId);
          if (params.limit) queryParams.append("limit", String(params.limit));
          if (params.page) queryParams.append("page", String(params.page));
        }
        const query = queryParams.toString();

        // Pass the accessToken in headers
        const res = await api.get(
          `/visit/get-visits${query ? "?" + query : ""}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        return res.data;
      },
      thunkAPI.dispatch,
      thunkAPI.getState
    );
    return data;
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data || {
      statusCode: 500,
      title: "",
      message: err.message,
    };
    return thunkAPI.rejectWithValue(errorResponse);
  }
});

/*// GET many visits
export const getVisits = createAsyncThunk<
  { data: Visit[]; pagination: ApiPagination },
  GetVisitsQuery | undefined,
  { rejectValue: ApiResponse }
>("visit/getVisits", async (params, thunkAPI) => {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      queryParams.append("visitorId", params.visitorId);
      if (params.limit) queryParams.append("limit", String(params.limit));
      if (params.page) queryParams.append("page", String(params.page));
    }
    const query = queryParams.toString();
    const res = await api.get(`/visit/get-visits${query ? "?" + query : ""}`);
    return res.data;
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data || {
      statusCode: 500,
      title: "",
      message: err.message,
    };
    return thunkAPI.rejectWithValue(errorResponse);
  }
});*/

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
    const res = await api.delete(`/visit/delete-visit?id=${id}`);
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

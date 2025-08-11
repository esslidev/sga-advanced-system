import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../core/services/api";
import type { Visit } from "../../models/visit";
import type { ApiResponse } from "../../models/apiResponse";
import type { ApiPagination } from "../../models/apiPagination";
import { authRequestHandler } from "../../../core/utils/apiUtil";
import type { AppDispatch, RootState } from "../store";

type GetVisitsPayload = {
  visitorId: string;
  limit?: number;
  page?: number;
};

// GET many visits
export const getVisits = createAsyncThunk<
  { data: Visit[]; pagination: ApiPagination },
  GetVisitsPayload | undefined,
  { rejectValue: ApiResponse; dispatch: AppDispatch; state: RootState }
>("visit/getVisits", async (params, thunkAPI) => {
  const { dispatch, getState, rejectWithValue } = thunkAPI;
  try {
    const result = await authRequestHandler(
      async (accessToken) => {
        const queryParams = new URLSearchParams();

        if (params) {
          if (params.visitorId)
            queryParams.append("visitorId", params.visitorId);
          if (params.limit) queryParams.append("limit", String(params.limit));
          if (params.page) queryParams.append("page", String(params.page));
        }

        const query = queryParams.toString();
        const res = await api.get(
          `/visit/get-visits${query ? `?${query}` : ""}`,
          {
            headers: { authorization: accessToken },
          }
        );

        return res.data as { data: Visit[]; pagination: ApiPagination };
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

// ADD new visit
export const addVisit = createAsyncThunk<
  ApiResponse,
  Partial<Visit>,
  { rejectValue: ApiResponse; dispatch: AppDispatch; state: RootState }
>("visit/addVisit", async (newVisit, thunkAPI) => {
  const { dispatch, getState, rejectWithValue } = thunkAPI;
  try {
    const result = await authRequestHandler(
      async (accessToken) => {
        const res = await api.post("/visit/add-visit", newVisit, {
          headers: { authorization: accessToken },
        });
        return res.data;
      },
      dispatch,
      getState()
    );
    return result;
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data || {
      statusCode: 500,
      title: "",
      message: err.message,
    };
    return rejectWithValue(errorResponse);
  }
});

// UPDATE visit
export const updateVisit = createAsyncThunk<
  ApiResponse,
  Partial<Visit>,
  { rejectValue: ApiResponse; dispatch: AppDispatch; state: RootState }
>("visit/updateVisit", async (updatedVisit, thunkAPI) => {
  const { dispatch, getState, rejectWithValue } = thunkAPI;
  try {
    const result = await authRequestHandler(
      async (accessToken) => {
        const res = await api.put("/visit/update-visit", updatedVisit, {
          headers: { authorization: accessToken },
        });
        return res.data;
      },
      dispatch,
      getState()
    );
    return result;
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data || {
      statusCode: 500,
      title: "",
      message: err.message,
    };
    return rejectWithValue(errorResponse);
  }
});

// DELETE visit
export const deleteVisit = createAsyncThunk<
  ApiResponse,
  string,
  { rejectValue: ApiResponse; dispatch: AppDispatch; state: RootState }
>("visit/deleteVisit", async (id, thunkAPI) => {
  const { dispatch, getState, rejectWithValue } = thunkAPI;
  try {
    const result = await authRequestHandler(
      async (accessToken) => {
        const res = await api.delete(`/visit/delete-visit?id=${id}`, {
          headers: { authorization: accessToken },
        });
        return res.data;
      },
      dispatch,
      getState()
    );
    return result;
  } catch (err: any) {
    const errorResponse: ApiResponse = err.response?.data || {
      statusCode: 500,
      title: "",
      message: err.message,
    };
    return rejectWithValue(errorResponse);
  }
});

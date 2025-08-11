import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../core/services/api";
import type { Visitor } from "../../models/visitor";
import type { ApiResponse } from "../../models/apiResponse";
import type { ApiPagination } from "../../models/apiPagination";
import { authRequestHandler } from "../../../core/utils/apiUtil"; // Assuming this function exists
import type { AppDispatch, RootState } from "../store";

// ---------- Types ----------

type GetVisitorsPayload = {
  search?: string;
  orderByName?: boolean;
  limit?: number;
  page?: number;
};

// GET visitor
export const getVisitor = createAsyncThunk<
  { visitor: Visitor },
  string,
  { rejectValue: ApiResponse; dispatch: AppDispatch; state: RootState }
>("visitor/getVisitor", async (id, thunkAPI) => {
  const { dispatch, getState, rejectWithValue } = thunkAPI;
  try {
    const result = await authRequestHandler(
      async (accessToken) => {
        const res = await api.get(`/visitor/get-visitor/${id}`, {
          headers: { authorization: accessToken },
        });
        return { visitor: res.data.data };
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

// GET many visitors
export const getVisitors = createAsyncThunk<
  { data: Visitor[]; pagination: ApiPagination },
  GetVisitorsPayload | undefined,
  { rejectValue: ApiResponse; dispatch: AppDispatch; state: RootState }
>("/visitor/getVisitors", async (params, thunkAPI) => {
  const { dispatch, getState, rejectWithValue } = thunkAPI;
  try {
    const result = await authRequestHandler(
      async (accessToken) => {
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
          `/visitor/get-visitors${query ? "?" + query : ""}`,
          {
            headers: { authorization: accessToken },
          }
        );

        return res.data;
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

// ADD new visitor
export const addVisitor = createAsyncThunk<
  ApiResponse,
  Partial<Visitor>,
  { rejectValue: ApiResponse; dispatch: AppDispatch; state: RootState }
>("visitor/addVisitor", async (newVisitor, thunkAPI) => {
  const { dispatch, getState, rejectWithValue } = thunkAPI;
  try {
    const result = await authRequestHandler(
      async (accessToken) => {
        const res = await api.post("/visitor/add-visitor", newVisitor, {
          headers: { authorization: accessToken },
        });
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

// UPDATE visitor
export const updateVisitor = createAsyncThunk<
  ApiResponse,
  Partial<Visitor>,
  { rejectValue: ApiResponse; dispatch: AppDispatch; state: RootState }
>("visitor/updateVisitor", async (updatedVisitor, thunkAPI) => {
  const { dispatch, getState, rejectWithValue } = thunkAPI;
  try {
    const result = await authRequestHandler(
      async (accessToken) => {
        const res = await api.put("/visitor/update-visitor", updatedVisitor, {
          headers: { authorization: accessToken },
        });
        return res.data;
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

// DELETE visitor
export const deleteVisitor = createAsyncThunk<
  ApiResponse,
  string,
  { rejectValue: ApiResponse; dispatch: AppDispatch; state: RootState }
>("visitor/deleteVisitor", async (id, thunkAPI) => {
  const { dispatch, getState, rejectWithValue } = thunkAPI;
  try {
    const result = await authRequestHandler(
      async (accessToken) => {
        const res = await api.delete(`/visitor/delete-visitor?id=${id}`, {
          headers: { authorization: accessToken },
        });
        return res.data;
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

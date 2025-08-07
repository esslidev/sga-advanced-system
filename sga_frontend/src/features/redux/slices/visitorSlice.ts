import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  getVisitor,
  getVisitors,
  addVisitor,
  updateVisitor,
  deleteVisitor,
} from "../thunks/visitorThunks";
import type { Visitor } from "../../models/visitor";
import type { ApiResponse } from "../../models/apiResponse";
import type { ApiPagination } from "../../models/apiPagination";

interface VisitorState {
  visitors: Visitor[];
  selectedVisitor: Visitor | null;
  loading: boolean;
  response: ApiResponse | null;
  pagination: ApiPagination | null;
}

const initialState: VisitorState = {
  visitors: [],
  selectedVisitor: null,
  loading: false,
  response: null,
  pagination: null,
};

const visitorSlice = createSlice({
  name: "visitor",
  initialState,
  reducers: {
    clearVisitors: (state) => {
      state.visitors = [];
      state.pagination = null;
    },
    clearVisitor: (state) => {
      state.selectedVisitor = null;
    },
    clearResponse: (state) => {
      state.response = null;
    },
  },
  extraReducers: (builder) => {
    // GET ONE
    builder.addCase(getVisitor.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getVisitor.fulfilled,
      (state, action: PayloadAction<Visitor>) => {
        state.loading = false;
        state.selectedVisitor = action.payload;
      }
    );
    builder.addCase(getVisitor.rejected, (state, action) => {
      state.loading = false;
      state.response = action.payload ?? null;
    });

    // GET MANY
    builder.addCase(getVisitors.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getVisitors.fulfilled,
      (
        state,
        action: PayloadAction<{ data: Visitor[]; pagination: ApiPagination }>
      ) => {
        state.loading = false;
        state.visitors = action.payload.data;
        state.pagination = action.payload.pagination;
      }
    );
    builder.addCase(getVisitors.rejected, (state, action) => {
      state.loading = false;
      state.response = action.payload ?? null;
    });

    // ADD
    builder.addCase(addVisitor.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      addVisitor.fulfilled,
      (state, action: PayloadAction<ApiResponse>) => {
        state.loading = false;
        state.response = action.payload;
      }
    );
    builder.addCase(addVisitor.rejected, (state, action) => {
      state.loading = false;
      state.response = action.payload ?? null;
    });

    // UPDATE
    builder.addCase(updateVisitor.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateVisitor.fulfilled,
      (state, action: PayloadAction<ApiResponse>) => {
        state.loading = false;
        state.response = action.payload;
      }
    );
    builder.addCase(updateVisitor.rejected, (state, action) => {
      state.loading = false;
      state.response = action.payload ?? null;
    });

    // DELETE
    builder.addCase(deleteVisitor.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteVisitor.fulfilled,
      (state, action: PayloadAction<ApiResponse>) => {
        state.loading = false;
        state.response = action.payload;
      }
    );
    builder.addCase(deleteVisitor.rejected, (state, action) => {
      state.loading = false;
      state.response = action.payload ?? null;
    });
  },
});

export const { clearVisitors, clearVisitor, clearResponse } =
  visitorSlice.actions;
export default visitorSlice.reducer;

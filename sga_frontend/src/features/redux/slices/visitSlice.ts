import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  getVisits,
  addVisit,
  updateVisit,
  deleteVisit,
} from "../thunks/visitThunks";
import type { Visit } from "../../models/visit";
import type { ApiResponse } from "../../models/apiResponse";
import type { Pagination } from "../../models/apiPagination";

interface VisitState {
  visits: Visit[];
  selectedVisit: Visit | null;
  loading: boolean;
  response: ApiResponse | null;
  pagination: Pagination | null;
}

const initialState: VisitState = {
  visits: [],
  selectedVisit: null,
  loading: false,
  response: null,
  pagination: null,
};

const visitSlice = createSlice({
  name: "visit",
  initialState,
  reducers: {
    clearVisits: (state) => {
      state.visits = [];
      state.pagination = null;
    },
    clearVisit: (state) => {
      state.selectedVisit = null;
    },
    clearResponse: (state) => {
      state.response = null;
    },
  },
  extraReducers: (builder) => {
    // GET MANY
    builder.addCase(getVisits.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getVisits.fulfilled,
      (
        state,
        action: PayloadAction<{ data: Visit[]; pagination: Pagination }>
      ) => {
        state.loading = false;
        state.visits = action.payload.data;
        state.pagination = action.payload.pagination;
      }
    );
    builder.addCase(getVisits.rejected, (state, action) => {
      state.loading = false;
      state.response = action.payload ?? null;
    });

    // ADD
    builder.addCase(addVisit.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      addVisit.fulfilled,
      (state, action: PayloadAction<ApiResponse>) => {
        state.loading = false;
        state.response = action.payload;
      }
    );
    builder.addCase(addVisit.rejected, (state, action) => {
      state.loading = false;
      state.response = action.payload ?? null;
    });

    // UPDATE
    builder.addCase(updateVisit.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      updateVisit.fulfilled,
      (state, action: PayloadAction<ApiResponse>) => {
        state.loading = false;
        state.response = action.payload;
      }
    );
    builder.addCase(updateVisit.rejected, (state, action) => {
      state.loading = false;
      state.response = action.payload ?? null;
    });

    // DELETE
    builder.addCase(deleteVisit.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteVisit.fulfilled,
      (state, action: PayloadAction<ApiResponse>) => {
        state.loading = false;
        state.response = action.payload;
      }
    );
    builder.addCase(deleteVisit.rejected, (state, action) => {
      state.loading = false;
      state.response = action.payload ?? null;
    });
  },
});

export const { clearVisits, clearVisit, clearResponse } = visitSlice.actions;
export default visitSlice.reducer;

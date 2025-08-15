import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  Language,
  type SystemPreferences,
} from "../../models/systemPreferences";

const initialState: SystemPreferences = {
  language: Language.arabic, // default
};

const systemPreferencesSlice = createSlice({
  name: "systemPreferences",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    resetPreferences: () => initialState,
  },
});

export const { setLanguage, resetPreferences } = systemPreferencesSlice.actions;
export default systemPreferencesSlice.reducer;

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Language } from "../models/systemPreferences";
import { setLanguage } from "../redux/slices/systemPreferences";

export const useSystemPreferences = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const language = useAppSelector((state) => state.systemPreferences.language);

  // Actions
  const changeLanguage = (lang: Language) => dispatch(setLanguage(lang));

  return {
    language,
    changeLanguage,
  };
};

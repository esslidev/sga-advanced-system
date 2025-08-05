export type Language = "fr" | "ar";

export const Language = {
  french: "fr" as Language,
  arabic: "ar" as Language,
};

export type SystemPreferences = {
  language: Language;
};

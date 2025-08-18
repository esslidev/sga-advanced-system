// src/utils/translator.ts
import fr from "../../assets/locales/fr.json";
import ar from "../../assets/locales/ar.json";
import type { Language } from "../../features/models/systemPreferences";

type Translations = Record<string, any>;

const translations: Record<Language, Translations> = {
  fr,
  ar,
};

function getNestedTranslation(
  obj: Translations,
  path: string
): string | undefined {
  const result = path.split(".").reduce<any>((acc, part) => acc?.[part], obj);
  return typeof result === "string" ? result : undefined;
}

export const t = (key: string, lang: Language): string => {
  return getNestedTranslation(translations[lang], key) || key;
};

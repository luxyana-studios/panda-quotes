import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import de from "./de.json";
import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";

const deviceLanguage = getLocales()[0]?.languageCode ?? "en";
const supportedLanguages = ["en", "es", "de", "fr"];

// Always start in English so the language picker appears in English.
// The persisted language is applied after store rehydration.
export const deviceSuggestedLanguage = supportedLanguages.includes(
  deviceLanguage,
)
  ? deviceLanguage
  : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    de: { translation: de },
    fr: { translation: fr },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

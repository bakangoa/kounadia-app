import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en/translation.json";
import fr from "./fr/translation.json";

const deviceLanguage = getLocales()?.[0]?.languageCode ?? "en";

// eslint-disable-next-line import/no-named-as-default-member
i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    lng: deviceLanguage,
    fallbackLng: "en",
    debug: true,
    resources: {
      en: {
        translation: en,
      },
      fr: {
        translation: fr,
      },
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;

import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enAdd from "./en/add.json";
import enCommon from "./en/common.json";
import enHome from "./en/home.json";
import enLogin from "./en/login.json";
import enNotification from "./en/notification.json";
import enOnboarding from "./en/onboarding.json";
import enRegister from "./en/register.json";

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
    ns: ['common', 'home', 'add', "onboarding", "login", "register", "notification"],
    defaultNS: 'common',
    resources: {
      en: {
        common: enCommon,
        home: enHome,
        add: enAdd,
        onboarding: enOnboarding,
        login: enLogin,
        register: enRegister,
        notification: enNotification
      },
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;

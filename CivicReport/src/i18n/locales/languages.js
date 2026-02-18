import i18n from "i18next";
import { initReactI18next } from "react-i18next";


export const languages = {
    en: {translation: require('./en.json')},
    uk: {translation: require('./uk.json')},
}

export function initI18n(defaultLang = "en") {
    if (i18n.isInitialized) return i18n;

    i18n.use(initReactI18next).init({
        resources: languages,
        lng: defaultLang,
        fallbackLng: "en",
        interpolation: { escapeValue: false },
    });

    return i18n;
}

export default i18n;
import i18n, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import en from './en.json';
import fr from './fr.json';
import ru from './ru.json';

const resources: Resource = {
    en, fr, ru
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: (process.browser && localStorage.getItem("language") != null) ? (localStorage.getItem("language") as string) : 'en',
        load: "all",
        fallbackLng: "en",
        keySeparator: false,
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;

export const languages = ['en', 'fr', 'ru']
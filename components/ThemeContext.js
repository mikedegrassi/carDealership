import React, {useContext, useState} from "react";
import {StatusBar} from "react-native";

const ThemeContext = React.createContext();
const ThemeUpdateContext = React.createContext();

export function useTheme() {
    return useContext(ThemeContext);
}

export function useThemeUpdate() {
    return useContext(ThemeUpdateContext);
}

const LanguageContext = React.createContext();
const LanguageUpdateContext = React.createContext();

export function useLanguage() {
    return useContext(LanguageContext);
}

export function useLanguageUpdate() {
    return useContext(LanguageUpdateContext);
}

export function ThemeProvider({children}) {

    const [darkTheme, setDarkTheme] = useState(true);
    const [language, setLanguage] = useState('en'); // English as default language

    function toggleTheme() {
        setDarkTheme(prevDarkTheme => !prevDarkTheme); // Toggle between true and false on change
        StatusBar.setBarStyle(darkTheme ? 'dark-content' : 'light-content'); // Justifying the statusbar
    }

    function changeLanguage(lg) {
        setLanguage(lg); // lg contains chosen language from Setting.js
    }

    return (
        // Passing setters and getters to every page, Themeprovider in Navigator.js
        <ThemeContext.Provider value={darkTheme}>
            <LanguageContext.Provider value={language}>
            <ThemeUpdateContext.Provider value={toggleTheme}>
                <LanguageUpdateContext.Provider value={changeLanguage}>
                    {children}
                </LanguageUpdateContext.Provider>
            </ThemeUpdateContext.Provider>
            </LanguageContext.Provider>
        </ThemeContext.Provider>
    );

}
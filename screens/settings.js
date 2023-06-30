import {View, Text, StyleSheet, Pressable, Switch, Animated} from "react-native";
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from "react-native";
import {useLanguage, useLanguageUpdate, useTheme, useThemeUpdate} from "../components/ThemeContext";
import i18next from "i18next";

export default function Settings() {

    // Using context to change value
    const darkTheme = useTheme();
    const toggleTheme = useThemeUpdate();

    const language = useLanguage();
    const changeLanguage = useLanguageUpdate();

    const [position, setPosition] = useState(new Animated.Value(0));

    const setLanguage = () => {
        i18next.init({
            compatibilityJSON: 'v3',
            lng: language, // if you're using a language detector, do not define the lng option
            debug: false,
            resources: {
                en: {
                    translation: {
                        "continue": "Continue",
                        "appName": "Premium Car Dealerships",
                        "receipts": "Receipts",
                        "theme": "Theme",
                        "languages": "Languages",
                    }
                },
                nl: {
                    translation: {
                        "continue": "Doorgaan",
                        "appName": "Premium Autohandelaren",
                        "receipts": "Bonnetjes",
                        "theme": "Thema",
                        "languages": "Talen"
                    }
                },
                ita: {
                    translation: {
                        "continue": "Continua",
                        "appName": "Concessionaria di auto premium",
                        "receipts": "Ricevute",
                        "theme": "Tema",
                        "languages": "Le lingue"
                    }
                },
            }
        });

    };

    useEffect(() => {
        setLanguage();
    }, [language]);

    const startAnimation = () => {
        Animated.spring(position, {
            toValue: 10,
            friction: 1,
            tension: 300,
            useNativeDriver: true,
        }).start(() => {
            Animated.spring(position, {
                toValue: 10,
                friction: 1,
                tension: 10,
                useNativeDriver: true,
            }).start();
        });
    };

    useEffect(() => {
        startAnimation();
    }, []);

    return <View>
        <SafeAreaView style={darkTheme ? style.black : style.white}>

            <Animated.View style={{transform: [{translateY: position}]}}>
                <View style={{top: 200}}>

                    <View style={{alignSelf: "center", alignItems: "center", paddingBottom: 70}}>
                        <Text style={[darkTheme ? style.whiteText : style.blackText]}>
                            {i18next.t("theme")}
                        </Text>

                        {/* Select theme */}
                        <Switch
                            trackColor={{false: '#767577', true: 'white'}}
                            thumbColor={darkTheme ? 'green' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleTheme}
                            value={darkTheme}
                        />
                    </View>

                    <View style={{alignSelf: "center", alignItems: "center"}}>

                        <View>
                            <Text
                                style={[darkTheme ? style.whiteText : style.blackText]}>{i18next.t("languages")}</Text>
                        </View>

                        <View style={{flexDirection: "row", gap: 10}}>

                            {/* Select language */}
                            <Pressable onPress={() => changeLanguage('en')}>
                                <Text style={{color: language === 'en' ? 'red' : 'gray', fontSize: 16}}>English</Text>
                            </Pressable>

                            <Pressable onPress={() => changeLanguage('nl')}>
                                <Text
                                    style={{color: language === 'nl' ? 'red' : 'gray', fontSize: 16}}>Nederlands</Text>
                            </Pressable>

                            <Pressable onPress={() => changeLanguage('ita')}>
                                <Text style={{color: language === 'ita' ? 'red' : 'gray', fontSize: 16}}>Italiano</Text>
                            </Pressable>

                        </View>
                    </View>
                </View>
            </Animated.View>


        </SafeAreaView>
    </View>;
};

const style = StyleSheet.create({
    black: {
        backgroundColor: "black",
        height: 1000
    },
    white: {
        backgroundColor: "white",
        height: 1000
    },
    blackText: {
        color: "black",
        fontSize: 20, padding: 10
    },
    whiteText: {
        color: "white",
        fontSize: 20, padding: 10
    },

});
import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "react-native-screens/native-stack";

// Context for themes and languages
import {ThemeProvider, useTheme} from "../components/ThemeContext";

//Screens
import HomeScreen from '../screens/home';
import Welcome from "../screens/welcome";

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer screenOptions={{headerShown: false}}>
            <ThemeProvider>
                <Stack.Navigator>
                    <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}}/>
                    <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
                </Stack.Navigator>
            </ThemeProvider>
        </NavigationContainer>
    );
};

export default Navigation;
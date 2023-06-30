import React, {useEffect, useState} from 'react';

import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import List from "./list";
import Map from "./map";
import Icon from "react-native-vector-icons/FontAwesome";
import Settings from "./settings";
import {useTheme} from "../components/ThemeContext";
import {ActivityIndicator} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

export default function HomeScreen() {

    const url = "https://stud.hosted.hr.nl/1006780/car.json";

    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const [favorites, setFavorites] = useState([]);

    // use dark theme for tab navigator background
    const darkTheme = useTheme();

    const getData = async () => {

        try {
            // Set favorite to send on
            const jsonValue = await AsyncStorage.getItem('favorite');
            return jsonValue != null ? setFavorites(JSON.parse(jsonValue)) : null;

        } catch (e) {
            // error reading value
        }
    };

    useEffect(() => {
        // Get the asyncStorage data
        getData();

        // Fetch data from url
        fetch(url)
            .then((response) => response.json())
            .then((json) => setData(json.dealerships))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, []);

    return (
        // Activity Indicator to wait for data
        (isLoading ? <ActivityIndicator/> :
                <Tab.Navigator initialRouteName="HomeScreen" screenOptions={{
                    headerShown: false, headerBackVisible: false,
                    "tabBarStyle": [
                        {
                            "display": "flex",
                            "backgroundColor": darkTheme ? "black" : "white",

                        },
                        null
                    ]
                }}>
                    <Tab.Screen name="List" options={{
                        tabBarLabel: "List", tabBarIcon: ({color, size}) =>
                            <Icon name="bars" size={size} color={color}/>
                    }}>
                        {(props) => <List {...props} data={data} favorites={favorites}/>}
                    </Tab.Screen>
                    <Tab.Screen name="Map" options={{
                        tabBarLabel: "Map", tabBarIcon: ({color, size}) =>
                            <Icon name="globe" size={size} color={color}/>
                    }}>
                        {(props) => <Map {...props} data={data}/>}
                    </Tab.Screen>
                    <Tab.Screen name="Settings" options={{
                        tabBarLabel: "Settings", tabBarIcon: ({color, size}) =>
                            <Icon name="cogs" size={size} color={color}/>
                    }}>
                        {(props) => <Settings {...props}/>}
                    </Tab.Screen>
                </Tab.Navigator>
        ))
        ;
};
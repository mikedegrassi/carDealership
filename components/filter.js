import {Animated, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import filter from "lodash.filter";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Filter({setData, setShowFavorite, showFavorite, data, isFiltered, setIsFiltered}) {

    const [searchQuery, setSearchQuery] = useState("");
    const [filtered, setFiltered] = useState(false);

    const [newData, setNewData] = useState([]);

    const [position, setPosition] = useState(new Animated.Value(0));

    const startAnimation = () => {

        //Spring animation for the filter

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


    // Query and set the filtered query as data
    const handleSearch = (query) => {
        setSearchQuery(query);
        const formattedQuery = query.toLowerCase();
        const filteredData = filter(data, (dealership) => {
            return contains(dealership, formattedQuery);
        });
        setData(filteredData);
    };

    // Check if input matches my data
    const contains = ({brand, title}, query) => {
        return !!(brand.includes(query) || title.includes(query));
    };

    // Check if a filter is called
    const filterHandler = (brand) => {

        if (filtered === false) {
            handleSearch(brand);
            setIsFiltered(brand);
            setFiltered(true);
        } else {
            setData(data);
            handleSearch('');
            setIsFiltered([]);
            setFiltered(false);
        }

    };

    const getData = async () => {

        const array = [];

        try {

            const jsonValue = await AsyncStorage.getItem('favorite');

            // Translating given array to variable
            const allId = JSON.parse(jsonValue);

            // Setting data into array
            allId.map((id) => array.push(data[id]));

            // Set new data from array
            setNewData(array);

            if (showFavorite === true) {
                setData(data); // Set all data when removing filter
                setShowFavorite(false);
            } else {
                setData(newData); // Set filtered data when filtering
                setShowFavorite(true);
            }

        } catch (e) {
            // error reading value
        }
    };

    return <View style={{position: "absolute", top: 30, zIndex: 2, marginLeft: 20}}>

        <Animated.View style={{transform: [{translateY: position}]}}>

            <View style={style.filterView}>
                <Pressable style={style.filters} onPress={(query) => filterHandler("audi")}>
                    <Text style={[isFiltered.includes("audi") ? style.filteredText : style.filterText]}>Audi</Text>
                </Pressable>

                <Pressable style={style.filters} onPress={(query) => filterHandler("mercedes")}>
                    <Text
                        style={[isFiltered.includes("mercedes") ? style.filteredText : style.filterText]}>Mercedes</Text>
                </Pressable>

                <Pressable style={style.filters} onPress={(query) => filterHandler("bmw")}>
                    <Text style={[isFiltered.includes("bmw") ? style.filteredText : style.filterText]}>BMW</Text>
                </Pressable>

                <TouchableOpacity onPress={() => getData()}>
                    <Icon style={[showFavorite ? style.favoriteButtonOn : style.favoriteButton]} name="star"/>
                </TouchableOpacity>

            </View>

        </Animated.View>
    </View>;

}

const style = StyleSheet.create({
    layout: {
        flex: 1,
        marginHorizontal: 20
    },
    searchbar: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
    },
    filterView: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
    },
    filters: {
        width: 120
    },
    filterText: {
        textAlign: "center",
        margin: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: "lightblue",
    },
    filteredText: {
        overflow: "hidden",
        textAlign: "center",
        margin: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: "blue",
        color: "white"
    },
    favoriteButton: {
        fontSize: 20,
        color: "lightblue"
    },
    favoriteButtonOn: {
        color: "gold",
        fontSize: 20
    }
});
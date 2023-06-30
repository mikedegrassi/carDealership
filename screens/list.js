import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Pressable, ActivityIndicator, Animated
} from "react-native";

import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

// Filter
import Filter from "../components/filter";
import AsyncStorage from "@react-native-async-storage/async-storage";

// For navigating and the modal
import MapView, {Marker} from "react-native-maps";
import {useNavigation} from "@react-navigation/native";

// Translation
import {useLanguage, useTheme} from "../components/ThemeContext";
import i18next from "i18next";

export default function List(props) {

    const darkTheme = useTheme();
    const navigation = useNavigation();

    const language = useLanguage();

    const [isModalVisible, setModalVisible] = useState(false);
    const [item, setItem] = useState([]);
    const [data, setData] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [showFavorite, setShowFavorite] = useState(false);
    const [isFiltered, setIsFiltered] = useState([]);

    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

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
                        "receipts": "Receipts"
                    }
                },
                nl: {
                    translation: {
                        "continue": "Doorgaan",
                        "appName": "Premium Autohandelaren",
                        "receipts": "Bonnetjes"
                    }
                },
                ita: {
                    translation: {
                        "continue": "Continua",
                        "appName": "Concessionaria di auto premium",
                        "receipts": "Ricevute"
                    }
                },
            }
        });

    };

    const timing = () => {

        //Fade animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
        }).start();

        console.log(props.favorites);
    };

    useEffect(() => {
        setData(props.data);
        setFavorites(props.favorites);
        setLanguage();
        timing();
    }, [fadeAnim]);

    // Render every item for Flatlist
    const renderItem = ({item, index}) => {
        return (
            <View>
                <TouchableOpacity style={style.listItem} onPress={() => onPressItem(item)}>
                    <View>
                        <Text style={[darkTheme ? style.whiteText : style.blackText]}>
                            {item.capBrand}
                        </Text>
                        <Text style={style.listItemTitle}>
                            {item.title}
                        </Text>
                    </View>

                    <View>
                        <Icon style={style.arrow} name="chevron-right" size={16}
                              color={darkTheme ? "white" : "black"}/>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    // Opening Modal
    const onPressItem = (item) => {
        setModalVisible(true);
        setItem(item);
    };

    // Storing data in async storage or remove it
    const storeData = async (item) => {

        let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index);

        if (favorites.includes(item.id)) {

            const index = favorites.indexOf(item.id);
            favorites.splice(index, 1); // 2nd parameter means remove one item only

            setFavorites(favorites);

            try {
                await AsyncStorage.setItem(
                    'favorite',
                    JSON.stringify(favorites),
                );
            } catch (error) {
                // Error saving data
                console.log(error);
            }

        } else if (!favorites.includes(item.id)) {
            favorites.push(item.id);

            findDuplicates(favorites);

            setFavorites(favorites);

            try {
                await AsyncStorage.setItem(
                    'favorite',
                    JSON.stringify(favorites),
                );
            } catch (error) {
                // Error saving data
                console.log(error);
            }
        }

    };

    // Setting course to 1 location
    const closeAndNavigate = (item) => {
        setModalVisible(false);
        navigation.navigate('Map', {id: item.id});
    };

    return <View>
        <SafeAreaView style={darkTheme ? style.black : style.white}>

            {/* Using the filter */}
            <Filter setData={setData} setShowFavorite={setShowFavorite} showFavorite={showFavorite} data={props.data}
                    isFiltered={isFiltered} setIsFiltered={setIsFiltered} favorites={favorites}/>


            <Animated.View style={{opacity: fadeAnim}}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    style={{top: 80, marginLeft: 10}}
                />

                <Text style={{textAlign: "center", color: "gray", top: 200}}>®{i18next.t("appName")}</Text>
            </Animated.View>

            <Modal animationType="slide"
                   visible={isModalVisible}
                   onRequestClose={() => setModalVisible(false)}
            >
                <SafeAreaView style={[darkTheme ? style.black : style.white]}>

                    <View style={style.modalView}>

                        <View style={style.mapContainer}>

                            {/* Minimap inside of the modal */}
                            <MapView style={style.mapView}
                                     region={{...item.longlat, latitudeDelta: 0.001, longitudeDelta: 0.003}}
                                     scrollEnabled={false}>
                                <Marker key={item.id} coordinate={item.longlat}
                                />
                            </MapView>

                            <Text style={{backgroundColor: "lightgrey", padding: 10}}>{item.title}</Text>
                            <Text style={style.locationTitle}>{item.location}</Text>
                        </View>

                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-evenly"
                        }}>

                            <TouchableOpacity
                                style={{textAlign: "center", marginTop: 20, width: 60, alignSelf: "center"}}
                                onPress={() => setModalVisible(false)}>
                                <Text style={{
                                    backgroundColor: "lightgrey",
                                    padding: 10,
                                    textAlign: "center",
                                    borderRadius: 10,
                                    overflow: "hidden",
                                    marginLeft: 10
                                }}><Icon style={style.arrow} name="chevron-left" size={16}
                                         color="black"/></Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{textAlign: "center", marginTop: 20, width: 60, alignSelf: "center"}}
                                onPress={() => closeAndNavigate(item)}>
                                <Text style={{
                                    backgroundColor: "lightgrey",
                                    padding: 10,
                                    textAlign: "center",
                                    borderRadius: 10,
                                    overflow: "hidden"
                                }}><Icon style={style.arrow} name="map-pin" size={16}
                                         color="black"/></Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{textAlign: "center", marginTop: 20, width: 60, alignSelf: "center"}}
                                onPress={() => storeData(item)}>
                                <Text style={{
                                    backgroundColor: "lightgrey",
                                    padding: 10,
                                    textAlign: "center",
                                    borderRadius: 10,
                                    overflow: "hidden",
                                    marginRight: 10
                                }}><Icon style={[favorites.includes(item.id) ? style.goldStar : style.arrow]}
                                         name={[favorites.includes(item.id) ? "star" : "star-o"]}
                                         size={16}
                                         color="black"/></Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </SafeAreaView>
            </Modal>

        </SafeAreaView>
    </View>;
};

const style = StyleSheet.create({
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        marginLeft: 20,
        alignItems: "center"
    },
    listItemIcon: {
        marginRight: 10
    },
    listItemTitle: {
        fontSize: 12,
        color: 'lightgrey'
    },
    locationTitle: {
        fontSize: 12,
        color: 'white',
        paddingLeft: 10
    },
    modalHeadBrand: {
        textAlign: "center",
        fontSize: 24
    },
    modelHeadView: {
        flexDirection: "row",
        alignItems: "center"
    },
    mapView: {
        width: "100%",
        height: 230,
    },
    mapContainer: {
        borderRadius: 25,
        borderWidth: 2,
        borderColor: "lightgrey",
        backgroundColor: "lightgrey",
        width: "70%",
        height: 310,
        overflow: "hidden",
        alignSelf: "center",
    },
    arrow: {
        marginRight: 10
    },
    goldStar: {
        color: "yellow",
        marginRight: 10,
        fontSize: 18
    },
    starHidden: {
        display: "none"
    },
    black: {
        backgroundColor: "black",
        color: "white",
        height: 1000
    },
    white: {
        backgroundColor: "white",
        color: "black",
        height: 1000
    },
    blackText: {
        color: "black",
    },
    whiteText: {
        color: "white",
    },
    modalView: {
        top: 200
    },
    showLocation: {
        textAlign: "center",
        color: "blue"
    },
    modalStar: {
        fontSize: 16

    },
    favoriteModalStar: {
        color: "yellow",
        fontSize: 16
    }


});
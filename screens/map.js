import React, {useEffect, useRef, useState} from 'react';
import MapView from 'react-native-maps';
import {Marker} from "react-native-maps";
import {
    StyleSheet,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import * as Location from 'expo-location';
import Filter from "../components/filter";
import {getDistance} from 'geolib';
import {nearLocationNotification} from "../components/Notification";
import {useTheme} from "../components/ThemeContext";
import MapViewDirections from "react-native-maps-directions";

export default function Map(props) {

    //for getting users location
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [isFiltered, setIsFiltered] = useState([]);

    const darkTheme = useTheme();

    const [data, setData] = useState([]);
    const [showFavorite, setShowFavorite] = useState(false);
    const {id} = props.route.params ? props.route.params : "";

    // Sending notification to user if near location
    const nearLocation = async () => {

        if (location.coords) {
            let user = {
                longitude: location.coords.longitude,
                latitude: location.coords.latitude
            };

            // Calculating distance
            let distance = getDistance(user, camera.center, 1);

            distance < 1000 ? nearLocationNotification() : '';
        }
    };

    useEffect(() => {
        setData(props.data);
        // nearLocation();
    }, []);


    // Handler for all location activities
    useEffect(() => {
        (async () => {

            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();

    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    const mapRef = useRef(null);

    // Navigate to user location
    const centerUser = () => {
        if (location.coords) {
            mapRef.current.animateToRegion(location.coords, 1000);
        }

    };

    const dealership = props.data.find((item) => {
        return item.id === id;
    });

    // When there is an id given, zoom in on it
    const camera = {
        center: {
            latitude: id !== "" && dealership ? dealership.longlat.latitude : 51.9225,
            longitude: id !== "" && dealership ? dealership.longlat.longitude : 4.47917,
        },
        pitch: 1,
        heading: 1,
        altitude: id !== "" ? 3 : 1,
    };

    return (
        <View style={style.container}>

            <SafeAreaView style={darkTheme ? style.white : style.black}>
                <Filter setData={setData} setShowFavorite={setShowFavorite} showFavorite={showFavorite}
                        data={props.data} isFiltered={isFiltered} setIsFiltered={setIsFiltered}/>

                {location ? (
                    <TouchableOpacity style={style.centerPress} onPress={centerUser}>
                        <Text style={style.center}>Center</Text>
                    </TouchableOpacity>
                ) : ''}

                <MapView style={style.map} region={{
                    longitude: 4.48541012993528,
                    latitude: 51.925398896740724,
                    longitudeDelta: 0.25,
                    latitudeDelta: 0.02
                }} ref={mapRef} showsUserLocation={true} userInterfaceStyle={darkTheme ? "dark" : "light"}
                         loadingEnabled={true} showsCompass={true} showsTraffic={true} showsScale={true}
                         camera={camera}
                >
                    {data.map((item) => {
                        return <Marker key={item.id} coordinate={item.longlat} title={item.capBrand}
                                       description={item.title}/>;
                    })}

                    {/* Make course for location */}
                    {location ? (
                        <MapViewDirections
                            origin={{longitude: location.coords.longitude, latitude: location.coords.latitude}}
                            destination={{
                                longitude: camera.center.longitude,
                                latitude: camera.center.latitude
                            }}
                            apikey={'AIzaSyCsPFpvXUEN8514eRPIrzG-nSsscYwEjqU'}
                            strokeWidth={3}
                            strokeColor="yellow"
                        />
                    ) : ''}
                </MapView>

                <Text>{text}</Text>
            </SafeAreaView>

        </View>
    );
}

const style = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
    centerPress: {
        width: 80,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: "center",
        padding: 8,
        borderRadius: 100,
        backgroundColor: 'lightblue',
        position: "absolute",
        marginTop: 750,
        zIndex: 1
    },
    center: {
        textAlign: "center",
        fontSize: 14,
    },
    black: {
        backgroundColor: "black"
    },
    white: {
        backgroundColor: "white"
    }
});
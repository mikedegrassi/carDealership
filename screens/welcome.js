import {Text, StyleSheet, SafeAreaView, ImageBackground, Pressable, Animated} from "react-native";
import React, {useEffect, useRef} from 'react';
import welcomeBG from '../assets/welcome.png';

export default function Welcome({navigation}) {

    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

    const startAnimation = () => {
        // Fade animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        startAnimation();
    }, []);

    return (
        <ImageBackground source={welcomeBG} style={style.background}>
            <SafeAreaView>
                <Animated.View style={{opacity: fadeAnim}}>
                    <Text style={style.welcomeText}>
                        Premium Car Dealerships
                    </Text>
                    <Pressable style={style.button} onPress={() => navigation.navigate('Home')}>
                        <Text style={style.text}>Continue</Text>
                    </Pressable>
                </Animated.View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const style = StyleSheet.create({
    background:
        {
            flex: 1,
            resizeMode: 'cover'
        },
    welcomeText: {
        marginTop: 40,
        fontSize: 50,
        textAlign: "center"
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        width: 150,
        marginTop: 150,
        backgroundColor: 'black',
        alignSelf: "center",
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ScreenWrapper from '../components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import { hp, wp } from '../helpers/commen'
import { theme } from '../constants/theme'
import Button from '../components/Button'
import { useRouter } from 'expo-router'

const welcome = () => {
    const router = useRouter()
    return (
        <ScreenWrapper bg="white">
            <StatusBar style='dark' />
            <View style={styles.container}>

                <Image source={require('../assets/images/welcome.png')} style={styles.image} resizeMode='contain' />

                <View style={{ gap: 20 }}>
                    <Text style={styles.title}>ExploreIT!</Text>
                    <Text style={styles.punchline}>
                        Where you find variety of blog posts to know latest trend.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Button title='Getting started' onPress={() => router.push("sign-up")} />
                    <View style={styles.footerTextContainer}>
                        <Text>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.push("sign-in")}>
                            <Text style={styles.loginText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
        paddingHorizontal: wp(4)
    },
    image: {
        height: hp(40),
        width: wp(40)
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(4),
        textAlign: "center",
        fontWeight: theme.fonts.extraBold
    },
    punchline: {
        textAlign: "center",
        paddingHorizontal: wp(10),
        fontSize: hp(1.7),
        color: theme.colors.text
    },
    footer: {
        width: '100%',
        gap: 10
    },
    footerTextContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5
    },
    loginText: {
        color: theme.colors.primary
    },
})
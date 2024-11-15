import { Alert, StyleSheet, Text, BackHandler, ToastAndroid, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { View } from 'react-native'
import { hp, wp } from '../../helpers/commen'
import { theme } from '../../constants/theme'
import Icon from '../../assets/icons'
import { Image } from 'expo-image'

const Home = () => {
    const router = useRouter()
    const { user, setUser, setToken } = useAuth()
    const [backPressCount, setBackPressCount] = useState(0);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            Alert.alert(error.message)
        } else {
            await AsyncStorage.clear()
            setUser(null)
            setToken(null)
            router.replace("welcome")
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (backPressCount === 0) {
                    ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT)
                    setBackPressCount(1)
                    setTimeout(() => setBackPressCount(0), 2000)
                } else {
                    BackHandler.exitApp()
                }
                return true
            }
            BackHandler.addEventListener('hardwareBackPress', onBackPress)
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
        }, [backPressCount])
    )

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>ExploreIt!</Text>
                    <View style={styles.icons}>
                        <TouchableOpacity onPress={() => router.push("notifications")}>
                            <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push("newPost")}>
                            <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push("profile")}>
                            <Image
                                source={user?.image ? { uri: user.image } : require("../../assets/images/defaultUser.png")}
                                contentFit='cover'
                                style={styles.image}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {/* <Button title='Logout' onPress={handleLogout} /> */}
        </ScreenWrapper>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        // alignItems:"center",
        justifyContent: "space-between",
        marginBottom: 10,
        marginHorizontal: wp(4),
        // borderWidth: 2,
        // borderColor: "red"
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(4),
        fontWeight: theme.fonts.bold
    },
    icons: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    image: {
        width: wp(8),
        height: hp(3.7),
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: 60
    }
}) 
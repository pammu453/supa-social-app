import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'expo-router'
import Header from '../../components/Header'
import Icon from '../../assets/icons'
import { theme } from '../../constants/theme'
import { hp, wp } from '../../helpers/commen'
import { supabase } from '../../lib/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Profile = () => {
    const { user, setUser, setToken } = useAuth()
    const router = useRouter()

    const onLogout = async () => {
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

    const handleLogout = () => {
        Alert.alert("Comfirm", "Are you sure you want to logout?", [
            {
                text: "Cancel",
                onPress: () => console.log("Canceled"),
                style: "cancel"

            },
            {
                text: "Logout",
                onPress: () => onLogout(),
                style: "destructive"
            }
        ])
    }

    return (
        <ScreenWrapper bg="white">
            <UserHeader user={user} router={router} onLogout={handleLogout} />
        </ScreenWrapper>
    )
}

const UserHeader = ({ user, router, onLogout }) => {
    return (
        <View style={styles.container}>
            <View>
                <Header title="Profile" showBackButton={true} />
                <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
                    <Icon name="logout" color={theme.colors.rose} />
                </TouchableOpacity>
            </View>
            <View style={styles.detailContainer}>
                <View style={{ gap: 15 }}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={user?.image ? { uri: user.image } : require("../../assets/images/defaultUser.png")}
                            contentFit='contain'
                            style={styles.image}
                        />
                        <TouchableOpacity onPress={() => router.push("editProfile")} style={styles.edit}>
                            <Icon name="edit" strokeWidth={2.5} size={25} />
                        </TouchableOpacity>
                    </View>

                    {/* username and address */}
                    <View style={{ alignItems: "center", gap: 4 }}>
                        <Text style={styles.username}>{user && user.name}</Text>
                        <View style={{ flexDirection: "row", gap: 2 }}>
                            <Icon name='location' size={20} />
                            <Text style={styles.infoText}>{user && user.address ? user.address : " Not available"}</Text>
                        </View>
                    </View>

                    <View style={styles.infoContainer}>
                        <View style={styles.info}>
                            <Icon name='mail' size={20} color={theme.colors.textLight} />
                            <Text style={styles.infoTextLeftAligned}>{user && user.name}</Text>
                        </View>
                        <View style={styles.info}>
                            <Icon name='call' size={20} color={theme.colors.textLight} />
                            {
                                user && user.phoneNumber ? <Text style={styles.infoTextLeftAligned}>{user && user.phoneNumber}</Text> : <Text style={styles.infoTextLeftAligned}>Not availbale</Text>
                            }
                        </View>
                        <View style={styles.info}>
                            <Icon name='star' size={20} color={theme.colors.textLight} />
                            {
                                user && user.bio ? <Text style={styles.infoTextLeftAligned}>{user && user.bio}</Text> : <Text style={styles.infoTextLeftAligned}>Not availbale</Text>
                            }
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: wp(4),
    },
    logoutButton: {
        position: "absolute",
        right: 0,
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: "#fee2e2"
    },
    avatarContainer: {
        height: hp(12),
        width: hp(12),
        alignSelf: "center",
    },
    detailContainer: {
        marginTop: 80
    },
    image: {
        height: hp(12),
        width: hp(12),
        borderRadius: theme.radius.xxl,
    },
    edit: {
        position: "absolute",
        right: -12,
        bottom: -5,
        padding: 7,
        borderRadius: 50,
        backgroundColor: "white",
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 7
    },
    username: {
        fontSize: hp(3.2),
        fontWeight: theme.fonts.bold,
    },
    infoText: {
        fontSize: hp(2),
    },
    infoContainer: {
        gap: 20,
        marginTop: 30,
    },
    info: {
        flexDirection: "row",
        gap: 20,
        alignItems: "center",
        borderWidth: 0.3,
        padding: wp(3.5),
        borderColor: theme.colors.primaryDark,
        borderRadius: theme.radius.xs,
    },
    infoTextLeftAligned: {
        fontSize: hp(2.3),
        flex: 1,
    }
})
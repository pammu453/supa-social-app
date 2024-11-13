import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import BackButton from './BackButton'
import { hp } from '../helpers/commen'
import { theme } from '../constants/theme'


const Header = ({ title, showBackButton = false, mb = 10 }) => {
    const router = useRouter()
    return (
        <View style={[styles.container, { marginBottom: mb }]}>
            {
                showBackButton && (
                    <View style={styles.backButton}>
                        <BackButton router={router} />
                    </View>
                )
            }
            <Text style={styles.title}>{title ? title : ''}</Text>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
        gap: 10
    },
    backButton: {
        position: "absolute",
        left: 0
    },
    title: {
        fontSize: hp(2.7),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.textDark
    }
})
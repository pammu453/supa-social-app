import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Icon from '../assets/icons/index'
import { theme } from '../constants/theme'

const BackButton = ({ size = 26, router }) => {

    return (
        <TouchableOpacity onPress={() => router.back()} style={styles.button}>
            <Icon
                name='arrowLeft'
                strokeWidth={3}
                size={size}
                color={theme.colors.text}
            />
        </TouchableOpacity>
    )
}

export default BackButton

const styles = StyleSheet.create({
    button: {
        alignSelf: "flex-start",
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: "rgba(0,0,0,0.05)"
    }
})
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp } from '../helpers/commen'
import Loading from './Loading'

const Button = ({ buttonStyle, textSyle, title = '', onPress, loading = false, hasShadow = true }) => {

    const shadowStyle = {
        shadowColor: theme.colors.dark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8
    }

    const loadingStyle={
        backgroundColor: theme.colors.secondary
    }

    if (loading) return <View style={[styles.button, buttonStyle, hasShadow && shadowStyle, loading && loadingStyle]}>
        <Loading size='small' color='white' />
    </View>

    return (
        <TouchableOpacity 
        onPress={onPress} 
        style={[styles.button, buttonStyle, hasShadow && shadowStyle,loading && loadingStyle]}
        disabled={loading}
        >
            <Text style={[styles.text, textSyle]}>{title}</Text>
        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.colors.primary,
        height: hp(6.6),
        justifyContent: "center",
        alignItems: "center",
        borderCurve: "circular",
        borderRadius: theme.radius.xl
    },
    text: {
        fontSize: hp(2.5),
        color: "white"
    }
})
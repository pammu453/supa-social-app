import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp } from '../helpers/commen'

const Input = ({ containerStyles, icon, placeholder, onChangeText, value, ...props }) => {
    return (
        <View style={[styles.container, containerStyles && containerStyles]}>
            {icon && icon}
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textLight}
                onChangeText={onChangeText}
                value={value}
                style={{ flex: 1 }}
                {...props}
            />
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: hp(7.2),
        alignItems: "center",
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: "continuous",
        paddingHorizontal: 18,
        gap: 12,
    }
})
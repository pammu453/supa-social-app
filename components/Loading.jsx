import { ActivityIndicator, StyleSheet, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'

const Loading = ({ size = 'large', color = theme.colors.primary }) => {
    return (
        <View style={styles.indicatior}>
            <ActivityIndicator size={size} color={color} />
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    indicatior: {
        justifyContent: "center",
        alignItems: "center"
    }
})
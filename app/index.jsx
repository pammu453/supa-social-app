import React from 'react'
import { View,LogBox } from 'react-native'
import Loading from '../components/Loading'

LogBox.ignoreAllLogs(true)

const index = () => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Loading size="large" />
        </View>
    )
}

export default index
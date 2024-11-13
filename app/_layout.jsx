import { router, Stack } from 'expo-router'
import React, { useEffect } from 'react'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { getUserData } from '../services/userService'
import { Alert } from 'react-native'

const _layout = () => {
    return (
        <AuthProvider>
            <MainLayout />
        </AuthProvider>
    )
}

const MainLayout = () => {
    const { setToken, setUser } = useAuth()

    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setToken(session?.access_token)
                updateUser(session?.user)
                router.replace("home")
            } else {
                setUser(null)
                setToken(null)
                router.replace("welcome")
            }
        })
    }, [])

    const updateUser = async (user) => {
        const res = await getUserData(user.id)
        if (res.success) {
            setUser(res.data)
        } else {
            Alert.alert(res.error)
        }
    }

    return (
        <Stack
            screenOptions={{ headerShown: false }}
        />
    )
}

export default _layout
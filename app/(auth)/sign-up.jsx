import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ScreenWrapper from '../../components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import BackButton from '../../components/BackButton'
import { useRouter } from 'expo-router'
import { hp, wp } from '../../helpers/commen'
import { theme } from '../../constants/theme'
import Input from '../../components/Input'
import Icon from '../../assets/icons'
import Button from '../../components/Button'
import { supabase } from '../../lib/supabase'

const SignUp = () => {
    const router = useRouter()
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false);

    const handleSubmite = async () => {
        const name = form.username.trim()
        const email = form.email.trim()
        const password = form.password.trim()

        if (!name || !email || !password) {
            Alert.alert("Incomplete Information", "Please fill in all required fields to continue.")
            return
        }

        setLoading(true)
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    email
                }
            }
        })

        if (error) Alert.alert(error.message)

        setLoading(false)
    }

    return (
        <ScreenWrapper>
            <StatusBar style='dark' />
            <View style={styles.container}>
                <BackButton router={router} />

                <View>
                    <Text style={styles.welcomeText}>Lets,</Text>
                    <Text style={styles.welcomeText}>Getting started!</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.formTitle}>
                        Please signup to continue
                    </Text>
                    <Input
                        placeholder='johndoe'
                        icon={<Icon name='user' size={26} strokeWidth={1.6} />}
                        onChangeText={(text) => setForm({ ...form, username: text })}
                        value={form.username}
                    />
                    <Input
                        placeholder='johndoe@gmail.com'
                        icon={<Icon name='mail' size={26} strokeWidth={1.6} />}
                        onChangeText={(text) => setForm({ ...form, email: text })}
                        value={form.email}
                    />
                    <Input
                        placeholder='********'
                        icon={<Icon name='lock' size={26} strokeWidth={1.6} />}
                        onChangeText={(text) => setForm({ ...form, password: text })}
                        value={form.password}
                        secureTextEntry
                    />

                    <Button title='SignIn' onPress={handleSubmite} loading={loading} />

                    <View style={styles.formText}>
                        <Text>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.push("sign-in")}>
                            <Text style={{ color: theme.colors.primary }}>SignIn</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5)
    },
    welcomeText: {
        fontSize: hp(4),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text,
    },
    form: {
        gap: 25
    },
    formTitle: {
        fontSize: hp(2),
        color: theme.colors.text
    },
    formText: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 5,
    }
})
import { Image, StyleSheet, TouchableOpacity, View, TextInput, Alert, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import BackButton from '../../components/BackButton'
import { useRouter } from 'expo-router'
import { hp, wp } from '../../helpers/commen'
import { useAuth } from '../../context/AuthContext'
import Icon from '../../assets/icons'
import { theme } from '../../constants/theme'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { updateUserData } from '../../services/userService'
import * as ImagePicker from 'expo-image-picker';
import { uploadUserImage } from '../../services/imageService'

const EditProfile = () => {
    const router = useRouter()
    const { user, setUser } = useAuth()
    const [form, setForm] = useState({
        name: "",
        phoneNumber: "",
        address: "",
        bio: "",
        image: ""
    });
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
                bio: user.bio || '',
                image: user.image || ''
            })
        }
    }, [user])

    const handleImagePick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    }

    const handleUpdate = async () => {
        const { name, phoneNumber, address, bio } = form

        if (!name || !phoneNumber || !address || !bio) {
            Alert.alert("Profile", "Please fil all profile details")
        }
        setLoading(true)

        let updatedForm = { ...form }
        if (image) {
            const res = await uploadUserImage(user.id, image)
            if (res.success) {
                updatedForm.image = res.data
            } else {
                Alert.alert(res.error)
            }
        }

        const res = await updateUserData(user.id, updatedForm)
        if (res.success) {
            setUser(res.data?.[0])
            ToastAndroid.show('Profile updated', ToastAndroid.SHORT)
            router.back()
        } else {
            Alert.alert(res.error)
        }
        setLoading(false)
    }

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <BackButton router={router} />
                <View style={styles.avatarContainer}>
                    <Image
                        source={
                            image ? { uri: image.uri } : user?.image ? { uri: user.image } : require("../../assets/images/defaultUser.png")
                        }
                        contentFit='contain'
                        style={styles.image}
                    />
                    <TouchableOpacity onPress={handleImagePick} style={styles.edit}>
                        <Icon name="camera" strokeWidth={2.5} size={25} />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 40, gap: 10 }}>
                    <Input
                        placeholder='Enter new name'
                        icon={<Icon name='user' size={26} strokeWidth={1.6} />}
                        onChangeText={(text) => setForm({ ...form, name: text })}
                        value={form.name}
                        containerStyles={{ width: "100%" }}
                    />
                    <Input
                        placeholder='Enter new phone numner'
                        icon={<Icon name='call' size={26} strokeWidth={1.6} />}
                        onChangeText={(text) => setForm({ ...form, phoneNumber: text })}
                        value={form.phoneNumber}
                        containerStyles={{ width: "100%" }}
                    />
                    <Input
                        placeholder='Enter new address'
                        icon={<Icon name='location' size={26} strokeWidth={1.6} />}
                        onChangeText={(text) => setForm({ ...form, address: text })}
                        value={form.address}
                    />
                    <TextInput
                        style={styles.textArea}
                        value={form.bio}
                        onChangeText={(text) => setForm({ ...form, bio: text })}
                        placeholder="Enter your bio here..."
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                    <Button title='Update profile' loading={loading} onPress={handleUpdate} />
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wp(4)
    },
    avatarContainer: {
        height: hp(12),
        width: hp(12),
        alignSelf: "center",
        marginTop: 20
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
    textArea: {
        height: 150,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        borderRadius: theme.radius.sm,
        // backgroundColor: 'white',
        textAlignVertical: 'top',
        borderWidth: 0.4
    },
})
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Header from '../../components/Header'
import { hp, wp } from '../../helpers/commen'
import { useAuth } from '../../context/AuthContext'
import { Image } from 'expo-image'
import { theme } from '../../constants/theme'
import TextEditor from '../../components/TextEditor'
import Icon from '../../assets/icons'
import Button from '../../components/Button'
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av'
import { Alert } from 'react-native'
import { uploadUserImage } from '../../services/imageService'
import { addNewPost } from '../../services/postService'
import { useRouter } from 'expo-router'

const NewPost = () => {
    const richText = React.useRef();
    const router = useRouter()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false);
    const [editorData, setEditorData] = useState(null);
    const [file, setFile] = useState(null);

    const onPick = async (fileType) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: fileType === 'image'
                ? ImagePicker.MediaTypeOptions.Images
                : ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setFile(result.assets[0]);
        }
    }

    const handleSubmit = async () => {
        const isEditorEmpty = editorData?.replace(/<\/?[^>]+(>|$)/g, "").trim() === '';

        if (!file || isEditorEmpty) {
            Alert.alert("Post", "Please add content and image or video for post")
            return
        }
        setLoading(true)

        const res = await uploadUserImage(user.id, file)
        const url = res.data

        const res2 = await addNewPost({ file: url, body: editorData, userId: user.id })
        if (res2.success) {
            setEditorData('')
            richText.current.setContentHTML = ''
            setFile(null)
            router.push("home")
        }

        setLoading(false)
    }

    return (
        <ScreenWrapper >
            <ScrollView>
                <View style={styles.container}>
                    <Header title="New Post" showBackButton={true} />
                    <View style={styles.profileContainer}>
                        <Image source={user && user.image ? { uri: user.image } : require('../../assets/images/defaultUser.png')} contentFit='contain' style={styles.image} />
                        <View>
                            <Text style={styles.name}>{user?.name}</Text>
                            <Text style={styles.address}>{user?.address}</Text>
                        </View>
                    </View>
                    <TextEditor editorData={editorData} setEditorData={setEditorData} richText={richText} />
                    <View style={{ marginTop: 5 }}>
                        {
                            file?.type === "image" && <Image source={file.uri} contentFit='cover' style={styles.postImage} />
                        }
                        {
                            file?.type === "video" && <Video
                                style={styles.postImage}
                                source={{
                                    uri: file.uri,
                                }}
                                useNativeControls
                                resizeMode={ResizeMode.COVER}
                                isLooping
                            />
                        }
                    </View>
                    <View style={styles.mediaContainer}>
                        <Text style={styles.text}>Add to you post</Text>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity onPress={() => onPick("image")}>
                                <Icon name='image' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onPick("video")}>
                                <Icon name='video' size={29} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Button title='Add new post' onPress={handleSubmit} buttonStyle={{ margin: wp(4) }} loading={loading} />
        </ScreenWrapper>
    )
}

export default NewPost

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wp(4),
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 20,
        borderBottomColor: "#c6c3b3",
        borderBottomWidth: 1,
        paddingBottom: 9
    },
    image: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderRadius: 100,
        borderColor: "#c6c3b3",
    },
    name: {
        fontWeight: theme.fonts.bold,
        fontSize: hp(3)
    },
    mediaContainer: {
        flexDirection: "row",
        padding: wp(4),
        justifyContent: "space-between",
        backgroundColor: "#c6c3b3",
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center"
    },
    text: {
        fontSize: 15
    },
    iconContainer: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center"
    },
    postImage: {
        width: "100%",
        height: hp(35),
        borderRadius: 10,
    }
})
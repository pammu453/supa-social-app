import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import Icon from '../assets/icons'
import { deletePost } from '../services/postService'
import { useRouter } from 'expo-router'

const EditDelete = ({ item, setPosts }) => {
    const router = useRouter()

    const handleDelete = async () => {
        Alert.alert(
            "Delete post",
            "Are you sure to delete post?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Canceled")
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        const res = await deletePost(item.id)
                        if (res.success) {
                            setPosts(prevPosts => prevPosts.filter(post => post.id !== item.id))
                        }
                        else Alert.alert(res.error)
                    }
                }
            ]
        )
    }

    const handleEdit = async () => {
        router.push({ pathname: "newPost", params: { id: item.id, body: item.body, file:item.file} })
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleDelete}>
                <Icon name='delete' size={30} strokeWidth={1} style={styles.icon} color="red" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEdit}>
                <Icon name='edit' size={30} strokeWidth={1} style={styles.icon} color="green" />
            </TouchableOpacity>
        </View>
    )
}

export default EditDelete

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 10
    }
})
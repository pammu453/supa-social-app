import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Header from '../../components/Header'
import { hp, wp } from '../../helpers/commen'
import { ScrollView } from 'react-native'
import PostCard from '../../components/PostCard'
import { useAuth } from '../../context/AuthContext'
import { getUserPosts } from '../../services/postService'
import Loading from '../../components/Loading'
import { theme } from '../../constants/theme'
import { router } from 'expo-router'

const List = () => {
    const { user } = useAuth()
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        const fetchUserPosts = async () => {
            const res = await getUserPosts(user.id)
            if (res.success) setPosts(res.data)
            else Alert.alert(res.error)
            setLoading(false)
        }
        fetchUserPosts()
    }, [])

    return (
        <ScreenWrapper>
            <ScrollView>
                <View >
                    <View style={styles.header}>
                        <Header title="Your Posts" showBackButton={true} />
                    </View>
                    {loading ?
                        <View style={styles.loading}>
                            <Loading />
                        </View>
                        : <FlatList
                            data={posts}
                            renderItem={({ item }) => (
                                <PostCard item={item} hasShown={false} editDeleteShown={true} setPosts={setPosts} />
                            )}
                            ListEmptyComponent={(
                                <View style={styles.emptyListContainer}>
                                    <Text style={styles.emptyList}>No Posts created by you yet!</Text>
                                    <TouchableOpacity style={styles.createButton} onPress={() => router.push("newPost")}>
                                        <Text>Create Post</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    }
                </View>
            </ScrollView>
        </ScreenWrapper>
    )
}

export default List

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: wp(4)
    },
    loading: {
        marginTop: 50
    },
    emptyListContainer: {
        marginTop: hp(40),
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyList: {
        fontSize: 15,
        textAlign: 'center',
        color: theme.colors.textDark,
    },
    createButton: {
        padding: 10,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.xl,
        marginTop: 10
    }
})
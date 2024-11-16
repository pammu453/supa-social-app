import { Alert, StyleSheet, Text, BackHandler, ToastAndroid, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { View } from 'react-native'
import { hp, wp } from '../../helpers/commen'
import { theme } from '../../constants/theme'
import Icon from '../../assets/icons'
import { Image } from 'expo-image'
import { getAllPosts } from '../../services/postService'
import PostCard from '../../components/PostCard'
import { getUserData } from '../../services/userService'
import Loading from '../../components/Loading'

let limit = 0

const Home = () => {
    const router = useRouter()
    const { user } = useAuth()
    const [backPressCount, setBackPressCount] = useState(0);
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (backPressCount === 0) {
                    ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT)
                    setBackPressCount(1)
                    setTimeout(() => setBackPressCount(0), 2000)
                } else {
                    BackHandler.exitApp()
                }
                return true
            }
            BackHandler.addEventListener('hardwareBackPress', onBackPress)
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
        }, [backPressCount])
    )

    const fetchPosts = async () => {
        if (!hasMore) return null
        limit = limit + 5
        console.log("Fetched posts", limit)
        const res = await getAllPosts(limit)
        if (res.success) {
            if (posts.length === res.data.length) setHasMore(false)
            setPosts(res.data)
        } else {
            Alert.alert(res.error)
        }
    }

    const handlePostEnent = async (payload) => {
        if (payload.eventType === "INSERT" && payload?.new?.id) {
            let newPost = { ...payload.new }
            let res = await getUserData(newPost.userId)
            if (res.success) {
                newPost.user = res.data
            } else {
                Alert.alert(res.error)
            }
            setPosts([newPost, ...posts])
        }
    }

    useEffect(() => {
        const supabaseChanel = supabase
            .channel('posts')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, handlePostEnent)
            .subscribe()

        // fetchPosts()

        return () => {
            supabase.removeChannel(supabaseChanel)
        }
    }, [])

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>ExploreIt!</Text>
                    <View style={styles.icons}>
                        <TouchableOpacity onPress={() => router.push("notifications")}>
                            <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push("newPost")}>
                            <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push("profile")}>
                            <Image
                                source={user?.image ? { uri: user.image } : require("../../assets/images/defaultUser.png")}
                                contentFit='cover'
                                style={styles.image}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.postCard}>
                    <FlatList
                        data={posts}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => <PostCard item={item} />}
                        onEndReached={() => {
                            fetchPosts()
                            console.log("end")
                        }}
                        onEndReachedThreshold={0}
                        ListFooterComponent={(
                            <View style={{ marginBottom: 60 }}>
                                {hasMore ? <Loading /> : null}
                            </View>
                        )}
                    />
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        marginHorizontal: wp(4),
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(4),
        fontWeight: theme.fonts.bold
    },
    icons: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    image: {
        width: wp(8),
        height: hp(3.7),
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: 60
    },
}) 
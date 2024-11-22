import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Header from '../../components/Header'
import { wp } from '../../helpers/commen'
import { ScrollView } from 'react-native'
import PostCard from '../../components/PostCard'
import { useAuth } from '../../context/AuthContext'
import { getUserPosts } from '../../services/postService'
import Loading from '../../components/Loading'

const List = () => {
    const { user } = useAuth()
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    }
})
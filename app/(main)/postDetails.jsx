import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import ScreenWrapper from '../../components/ScreenWrapper'
import { getPostDetails } from '../../services/postService'
import PostCard from '../../components/PostCard'
import Input from '../../components/Input'
import Icon from '../../assets/icons'
import { hp, wp } from '../../helpers/commen'
import { theme } from '../../constants/theme'
import Loading from '../../components/Loading'
import { addNewComment, deleteComment } from '../../services/commentService'
import { useAuth } from '../../context/AuthContext'
import { Image } from 'expo-image'
import moment from 'moment'
import { supabase } from '../../lib/supabase'
import { getUserData } from '../../services/userService'

const postDetails = () => {
    const { user } = useAuth()
    const { postId } = useLocalSearchParams()
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(true);
    const [commentLoading, setCommentLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getPostDetails(postId);
            if (res.success) {
                setPost(res.data);
                setComments(res.data.comments || []);
            } else {
                Alert.alert(res.error);
            }
            setLoading(false);
        };
        fetchData();
    }, [postId]);

    useEffect(() => {
        const commentSubscription = supabase
            .channel('comments')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'comments',
                    // filter: `postId=eq.${postId}`
                },
                async (payload) => {
                    if (payload.eventType === 'INSERT') {
                        let newComment = { ...payload.new }
                        const res = await getUserData(payload.new.userId)
                        if (res.success) {
                            newComment.user = res.data
                        }
                        setPost(prevPost => ({
                            ...prevPost,
                            comments: [newComment, ...prevPost.comments]
                        }))
                        setComments(prevComments => [newComment, ...prevComments])
                    } else if (payload.eventType === 'DELETE') {
                        setPost(prevPost => ({
                            ...prevPost,
                            comments: prevPost.comments.filter((comment) => comment.id !== payload.old.id)
                        }))
                        setComments((prevComments) =>
                            prevComments.filter((comment) => comment.id !== payload.old.id)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(commentSubscription);
        };
    }, []);

    if (loading) {
        return (
            <View style={styles.loading}>
                <Loading />
            </View>
        )
    }

    const handleComment = async () => {
        setCommentLoading(true)
        const res = await addNewComment({ userId: user?.id, postId, text: comment })
        if (res.success) setComment('');
        else Alert.alert(res.error)
        setCommentLoading(false)
    }

    const deleteCommentHandler = async (commentId) => {
        const res = await deleteComment(commentId)
        if (res.success) return
        else Alert.alert(res.error)
    }

    return (
        <ScreenWrapper>
            <ScrollView>
                <View style={styles.container}>
                    <PostCard item={post} hasShown={false} />
                    <View style={styles.commentContainer}>
                        <Input value={comment} onChangeText={text => setComment(text)} placeholder="Write something here..." containerStyles={{ flex: 1 }} />
                        <TouchableOpacity onPress={handleComment} style={styles.buttonContainer}>
                            {
                                commentLoading ?
                                    <Loading size='small' color='white' /> :
                                    <Icon name="send" size={25} strokeWidth={1} style={styles.sendButton} color={"white"} />
                            }
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={comments}
                        renderItem={({ item }) => (
                            <View style={styles.commentBox}>
                                <View style={styles.commetUser}>
                                    <Image
                                        source={
                                            item?.user?.image
                                                ? { uri: item.user.image }
                                                : require('../../assets/images/defaultUser.png')
                                        }
                                        contentFit="contain"
                                        style={styles.image}
                                    />
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.deleteButtonContainer}>
                                            <View style={styles.commentUserText}>
                                                <Text style={styles.username}>{item?.user?.name}</Text>
                                                <Text style={styles.time}>{moment(item?.created_at).fromNow()}</Text>
                                            </View>
                                            {
                                                item?.user.id === user.id && <TouchableOpacity onPress={() => deleteCommentHandler(item.id)}>
                                                    <Icon name="delete" size={20} color={theme.colors.rose} />
                                                </TouchableOpacity>
                                            }
                                        </View>
                                        <Text style={styles.commentText}>{item?.text}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>
            </ScrollView>
        </ScreenWrapper>
    )
}

export default postDetails

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    container: {
        gap: 10,
    },
    commentContainer: {
        flexDirection: "row",
        gap: 10,
        paddingHorizontal: wp(4),
        alignItems: "center"
    },
    buttonContainer: {
        borderRadius: theme.radius.xxl,
        paddingHorizontal: wp(7),
        height: hp(7.2),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 0.4,
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary
    },
    image: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderRadius: 100,
        borderColor: '#c6c3b3',
        alignItems: "flex-start",
    },
    deleteButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    commentBox: {
        marginHorizontal: wp(4),
        marginVertical: 10,
        borderWidth: 0.4,
        padding: wp(4),
        borderColor: theme.colors.lightGray,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.background,
    },
    commetUser: {
        flexDirection: "row",
        gap: 10,
    },
    commentUserText: {
        flexDirection: "row",
        gap: 10,
        alignItems: "baseline",
    },
    commentText: {
        flex: 1,
        textAlign: "justify"
    },
    username: {
        fontWeight: theme.fonts.bold,
        fontSize: 18,
    },
    time: {
        fontSize: 10,
        color: theme.colors.text,
    },
    delOrEdit: {
        flexDirection: "row-reverse",
        gap: "10",
        fontSize: 10
    }
})
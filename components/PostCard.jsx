import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { hp, wp } from '../helpers/commen';
import { Image } from 'react-native';
import { Video } from 'expo-av';
import { theme } from '../constants/theme';
import moment from 'moment';
import Icon from '../assets/icons';
import { useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';

const PostCard = ({ item }) => {
    const { width } = useWindowDimensions();

    const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv'];

    // Function to check file type
    const getFileType = (fileUrl) => {
        const extension = fileUrl.split('.').pop().toLowerCase();
        if (imageExtensions.includes(extension)) return 'image';
        if (videoExtensions.includes(extension)) return 'video';
        return 'unknown';
    };

    const fileType = item?.file ? getFileType(item.file) : null;

    let liked = false
    let likes = []

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* Profile Section */}
                <View style={styles.profileContainer}>
                    <Image
                        source={
                            item && item.user
                                ? { uri: item?.user?.image }
                                : require('../assets/images/defaultUser.png')
                        }
                        contentFit="contain"
                        style={styles.image}
                    />
                    <View>
                        <Text style={styles.name}>{item?.user?.name}</Text>
                        <Text style={styles.address}>{moment(item?.created_at).fromNow()}</Text>
                    </View>
                </View>
                <View>
                    <Icon name='threeDotsHorizontal' size={35} strokeWidth={3} style={styles.rotateIcon} />
                </View>
            </View>

            {item && item.body && (
                <View >
                    <RenderHTML
                        contentWidth={width}
                        source={{ html: item.body }}
                    />
                </View>
            )}

            {/* Post Content */}
            <View style={{ marginTop: 5 }}>
                {fileType === 'image' && (
                    <Image source={{ uri: item.file }} contentFit="cover" style={styles.postImage} />
                )}
                {fileType === 'video' && (
                    <Video
                        style={styles.postImage}
                        source={{
                            uri: item.file,
                        }}
                        useNativeControls
                        resizeMode="cover"
                        isLooping
                    />
                )}
                {fileType === 'unknown' && <Text style={styles.errorText}>Unsupported file type</Text>}
            </View>

            <View style={styles.footer}>
                <View style={styles.footerButton}>
                    <TouchableOpacity>
                        <Icon name="heart" color={liked ? theme.colors.rose : theme.colors.textLight} size={24} fill={liked ? theme.colors.rose : "white"} />
                    </TouchableOpacity>
                    <Text style={styles.count}>{likes?.length}</Text>
                </View>
                <View style={styles.footerButton}>
                    <TouchableOpacity>
                        <Icon name="comment" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.count}>{likes?.length}</Text>
                </View>
                <View style={styles.footerButton}>
                    <TouchableOpacity>
                        <Icon name="share" size={24} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default PostCard;

const styles = StyleSheet.create({
    container: {
        gap: 10,
        margin: wp(4),
        marginBottom: 10,
        borderRadius: theme.radius.xxl * 1.1,
        borderCurve: "continuous",
        padding: 10,
        paddingVertical: 12,
        backgroundColor: "white",
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: '#000',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingBottom: 9,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    rotateIcon: {
        transform: [{ rotate: '90deg' }],
        color: theme.colors.dark
    },
    image: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderRadius: 100,
        borderColor: '#c6c3b3',
    },
    name: {
        fontWeight: theme.fonts.bold,
        fontSize: hp(3),
    },
    address: {
        color: '#6d6d6d',
        fontSize: hp(2),
    },
    postImage: {
        width: '100%',
        height: hp(35),
        borderRadius: 10,
        backgroundColor: '#f0f0f0', // Placeholder color for videos
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
        fontSize: hp(2),
        marginTop: 10,
    },
    footer: {
        flexDirection: "row",
        gap: 20,
        padding: 1
    },
    footerButton: {
        flexDirection: "row",
        gap: 6,
        alignItems: "center"
    },
    count: {
        fontSize: 15
    }
});

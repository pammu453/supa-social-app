import * as FileSystem from 'expo-file-system'

export const downloadFile = async (url) => {
    try {
        const localUri = getLocalFilePath(url);
        const { uri } = await FileSystem.downloadAsync(url, localUri);
        return uri;
    } catch (error) {
        console.error("Download error:", error);
    }
};

export const getLocalFilePath = (filePath) => {
    const fileName = filePath.split('/').pop();
    return `${FileSystem.cacheDirectory}${fileName}`;
};
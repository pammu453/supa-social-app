import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

export const uploadUserImage = async (userID, file) => {
    try {
        const filePath = `${userID}/${Date.now()}_${file.fileName}`;

        const base64 = await FileSystem.readAsStringAsync(file.uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const arrayBuffer = decode(base64);

        const { data, error } = await supabase.storage.from('upload').upload(filePath, arrayBuffer, {
            contentType: file.mimeType,
            cacheControl: '3600',
            upsert: false,
        });

        if (error) {
            return { success: false, error: error.message };
        }
        const { data: publicURL } = supabase.storage.from('upload').getPublicUrl(data.path);

        return { success: true, data: publicURL.publicUrl };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

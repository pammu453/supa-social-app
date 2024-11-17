import { supabase } from "../lib/supabase"

export const addNewLike = async (likeData) => {
    try {
        const { data, error } = await supabase
            .from('postLikes')
            .upsert(likeData)
            .select()
            .single()

        if (error) {
            return { success: false, error: error.message }
        }

        return { success: true, data }

    } catch (error) {
        return { success: false, error: error.message }
    }
}

export const deleteLike = async (userId, postId) => {
    try {
        const { data, error } = await supabase
            .from('postLikes')
            .delete()
            .eq("userId", userId)
            .eq("postId", postId)
            .select()

        if (error) {
            return { success: false, error: error.message }
        }

        return { success: true, data }

    } catch (error) {
        return { success: false, error: error.message }
    }
}
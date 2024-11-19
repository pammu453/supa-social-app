import { supabase } from "../lib/supabase"

export const addNewComment = async (commentData) => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .upsert(commentData)
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

export const deleteComment = async (commentId) => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .delete()
            .eq("id", commentId)
            .select()

        if (error) {
            return { success: false, error: error.message }
        }

        return { success: true, data }

    } catch (error) {
        return { success: false, error: error.message }
    }
}
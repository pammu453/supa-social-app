import { supabase } from "../lib/supabase"

export const addNewPost = async (form) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .upsert(form)
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

export const getAllPosts = async (limit = 10) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                user: users (id,name,email,image),
                postLikes(*),
                comments(id)
            `)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) {
            return { success: false, error: error.message }
        }

        return { success: true, data }

    } catch (error) {
        return { success: false, error: error.message }
    }
}

export const getPostDetails = async (postId) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                user: users (id,name,image),
                postLikes(*),
                comments(*,user:users(id, name, image))
            `)
            .eq("id", postId)
            .order("created_at", { ascending: false, foreignTable: "comments" })
            .single()

        if (error) {
            return { success: false, error: error.message }
        }

        return { success: true, data }

    } catch (error) {
        return { success: false, error: error.message }
    }
}
import { supabase } from "../lib/supabase"

export const addNewPost = async (form) => {
    console.log("form", form)
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
import { supabase } from "../lib/supabase"

export const getUserData = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select()
            .eq('id', userId)
            .single()

        if (error) {
            return { success: false, error: error.message }
        }
        return { success: true, data }

    } catch (error) {
        return { success: false, error: error.message }
    }
}

export const updateUserData = async (userId, form) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .update(form)
            .eq('id', userId)
            .select()
        if (error) {
            return { success: false, error: error.message }
        }
        return { success: true, data }

    } catch (error) {
        return { success: false, error: error.message }
    }
}


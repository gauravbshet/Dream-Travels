"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase.server";

export async function removeFromWishlist(wishlistId: string) {
    const supabase = createServerSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthenticated" };

    const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("id", wishlistId)
        .eq("user_id", user.id); // RLS guard

    if (error) return { error: error.message };

    revalidatePath("/dashboard");
    return { success: true };
}

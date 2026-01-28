"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function normalizeText(value: unknown) {
    if (typeof value !== "string") return "";
    return value.trim();
}

export async function createTodo(formData: FormData) {
    const title = normalizeText(formData.get("title"));
    const note = normalizeText(formData.get("note"));

    if (!title) return;

    const supabase = await createClient();
    const { data: claims } = await supabase.auth.getClaims();
    const userId = claims?.claims?.sub;

    if (!userId) throw new Error("No user session");

    const { error } = await supabase.from("todos").insert({
        user_id: userId,
        title,
        note: note || null,
    });

    if (error) throw error;

    revalidatePath("/todos");
}

export async function toggleTodo(formData: FormData) {
    const id = normalizeText(formData.get("id"));
    const next = normalizeText(formData.get("next")); // "true" lub "false"

    if (!id) return;

    const is_done = next === "true";

    const supabase = await createClient();
    const { data: claims } = await supabase.auth.getClaims();
    const userId = claims?.claims?.sub;

    if (!userId) throw new Error("No user session");
    const { error } = await supabase
        .from("todos")
        .update({ is_done })
        .eq("id", id)
        .eq("user_id", userId);

    if (error) throw error;

    revalidatePath("/todos");
}

export async function updateTodo(formData: FormData) {
    const id = normalizeText(formData.get("id"));
    const title = normalizeText(formData.get("title"));
    const note = normalizeText(formData.get("note"));

    if (!id || !title) return;

    const supabase = await createClient();
    const { data: claims } = await supabase.auth.getClaims();
    const userId = claims?.claims?.sub;

    if (!userId) throw new Error("No user session");

    const { error } = await supabase
        .from("todos")
        .update({
            title,
            note: note || null,
        })
        .eq("id", id)
        .eq("user_id", userId);

    if (error) throw error;

    revalidatePath("/todos");
}

export async function deleteTodo(formData: FormData) {
    const id = normalizeText(formData.get("id"));
    if (!id) return;

    const supabase = await createClient();
    const { data: claims } = await supabase.auth.getClaims();
    const userId = claims?.claims?.sub;

    if (!userId) throw new Error("No user session");
    const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

    if (error) throw error;

    revalidatePath("/todos");
}

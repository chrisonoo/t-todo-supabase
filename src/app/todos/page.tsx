import { redirect } from "next/navigation";

import { MainContent, Section } from "@/components/layout/content/main-content";
import { TodoList } from "@/components/todos/todo-list";
import { createClient } from "@/lib/supabase/server";

export default async function TodosPage() {
    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
        redirect("/login");
    }

    const { data: todos, error } = await supabase
        .from("todos")
        .select("id,title,note,is_done,created_at")
        .order("created_at", { ascending: false });

    if (error) {
        return <pre>{error.message}</pre>;
    }

    return (
        <MainContent
            title="To Do"
            description="Your tasks and notes, visible only to you (RLS)."
        >
            <Section title="Tasks">
                <TodoList initialTodos={todos || []} />
            </Section>
        </MainContent>
    );
}

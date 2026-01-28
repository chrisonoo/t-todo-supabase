"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Edit3, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import {
    createTodo,
    deleteTodo,
    toggleTodo,
    updateTodo,
} from "../../modules/todos/actions";

interface Todo {
    id: string;
    title: string;
    note: string | null;
    is_done: boolean;
    created_at: string;
}

interface TodoListProps {
    initialTodos: Todo[];
}

export function TodoList({ initialTodos }: TodoListProps) {
    const [todos, setTodos] = useState(initialTodos);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editNote, setEditNote] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [newNote, setNewNote] = useState("");

    const startEditing = (todo: Todo) => {
        setEditingId(todo.id);
        setEditTitle(todo.title);
        setEditNote(todo.note || "");
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditTitle("");
        setEditNote("");
    };

    const handleUpdate = async (formData: FormData) => {
        try {
            const id = formData.get("id") as string;
            const title = formData.get("title") as string;
            const note = formData.get("note") as string;
            await updateTodo(formData);
            // Update local state instead of full page reload
            setTodos((prev) =>
                prev.map((todo) =>
                    todo.id === id
                        ? { ...todo, title, note: note || null }
                        : todo,
                ),
            );
            setEditingId(null);
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const handleToggle = async (formData: FormData) => {
        try {
            const id = formData.get("id") as string;
            await toggleTodo(formData);
            // Update local state instead of full page reload
            setTodos((prev) =>
                prev.map((todo) =>
                    todo.id === id ? { ...todo, is_done: !todo.is_done } : todo,
                ),
            );
        } catch (error) {
            console.error("Toggle failed:", error);
        }
    };

    const handleDelete = async (formData: FormData) => {
        try {
            const id = formData.get("id") as string;
            await deleteTodo(formData);
            // Update local state instead of full page reload
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleCreate = async (formData: FormData) => {
        try {
            // Temporarily add to local state for immediate UI update
            const tempTitle = formData.get("title") as string;
            const tempNote = formData.get("note") as string;
            const tempTodo = {
                id: "temp-" + Date.now(),
                title: tempTitle,
                note: tempNote || null,
                is_done: false,
                created_at: new Date().toISOString(),
            };
            setTodos((prev) => [tempTodo, ...prev]);

            // Clear form
            setNewTitle("");
            setNewNote("");

            // Submit to server
            await createTodo(formData);

            // Refresh to get real data
            window.location.reload();
        } catch (error) {
            console.error("Create failed:", error);
            // Remove temporary todo on error
            setTodos((prev) => prev.filter((t) => !t.id.startsWith("temp-")));
        }
    };

    return (
        <>
            {/* Add task form */}
            <form action={handleCreate} className="space-y-3 mb-6">
                <Input
                    name="title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Task title"
                    required
                />
                <Textarea
                    name="note"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Note (optional)"
                />
                <Button type="submit">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                </Button>
            </form>

            {todos && todos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>You don&apos;t have any todos yet.</p>
                    <p className="text-sm mt-2">Add your first task!</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {todos.map((t) => (
                        <li
                            key={t.id}
                            className="rounded-lg border p-4 space-y-2"
                        >
                            {editingId === t.id ? (
                                // Edit mode
                                <form
                                    action={handleUpdate}
                                    className="space-y-3"
                                >
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={t.id}
                                    />
                                    <Input
                                        name="title"
                                        value={editTitle}
                                        onChange={(e) =>
                                            setEditTitle(e.target.value)
                                        }
                                        placeholder="Task title"
                                        required
                                    />
                                    <Textarea
                                        name="note"
                                        value={editNote}
                                        onChange={(e) =>
                                            setEditNote(e.target.value)
                                        }
                                        placeholder="Note (optional)"
                                    />
                                    <div className="flex gap-2">
                                        <Button type="submit" size="sm">
                                            <Check className="h-4 w-4 mr-1" />
                                            Save
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={cancelEditing}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                // View mode
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div
                                            className={
                                                t.is_done
                                                    ? "line-through opacity-70"
                                                    : ""
                                            }
                                        >
                                            {t.title}
                                        </div>
                                        {t.note ? (
                                            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                {t.note}
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="flex gap-1">
                                        <form action={handleToggle}>
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={t.id}
                                            />
                                            <input
                                                type="hidden"
                                                name="next"
                                                value={String(!t.is_done)}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                type="submit"
                                                title={
                                                    t.is_done
                                                        ? "Mark as undone"
                                                        : "Mark as done"
                                                }
                                            >
                                                {t.is_done ? (
                                                    <RotateCcw className="h-4 w-4" />
                                                ) : (
                                                    <Check className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </form>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => startEditing(t)}
                                            title="Edit todo"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </Button>

                                        <form action={handleDelete}>
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={t.id}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                type="submit"
                                                title="Delete todo"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

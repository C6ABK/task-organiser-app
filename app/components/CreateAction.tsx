"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const CreateAction = () => {
    type Category = {
        id: string
        name: string
    }

    const [form, setForm] = useState({
        title: "",
        description: "",
        categoryId: "",
        priority: false,
        dueDate: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories")
                if (res.ok) {
                    const data = await res.json()
                    setCategories(data.categories)
                }
            } catch (err) {
                console.error("Failed to fetch categories", err)
            }
        }

        fetchCategories()
    }, [])

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target
        setForm({
            ...form,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            if (res.ok) {
                setForm({
                    title: "",
                    description: "",
                    categoryId: "",
                    priority: false,
                    dueDate: "",
                })
                router.refresh()
            } else {
                const data = await res.json()
                setError(data.error || "Failed to create task")
            }
        } catch (err) {
            console.error("Error creating task:", err)
            setError("Something went wrong")
        }

        setLoading(false)
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="font-bold text-2xl mb-4">Create New Task</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-bold mb-1"
                    >
                        Task Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter task title..."
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-bold mb-1"
                    >
                        Description
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter a task description..."
                        rows={3}
                    ></textarea>
                </div>

                <div>
                    <label
                        htmlFor="categoryId"
                        className="block text-sm font-bold mb-1"
                    >
                        Category
                    </label>
                    <select
                        name="categoryId"
                        id="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        required
                    >
                        <option value="" disabled>
                            Select a category...
                        </option>
                        {categories.map((category: Category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="dueDate"
                        className="block text-sm font-bold mb-1"
                    >
                        Due Date
                    </label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={form.dueDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        style={{
                            WebkitAppearance: "none",
                            MozAppearance: "none",
                            appearance: "none",
                            position: "relative",
                            paddingRight: "10px",
                        }}
                        onFocus={(e) =>
                            e.target.showPicker && e.target.showPicker()
                        }
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="priority"
                        name="priority"
                        checked={form.priority}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label htmlFor="priority" className="text-sm font-bold">
                        High Priority
                    </label>
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                >
                    {loading ? "Creating..." : "Create Task"}
                </button>
            </form>
        </div>
    )
}
export default CreateAction

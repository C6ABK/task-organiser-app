"use client"

import { useState } from "react"

type NextActionFormProps = {
    taskId: string
    onActionCreated: () => void
}

const NextActionForm = ({ taskId, onActionCreated }: NextActionFormProps) => {
    const [form, setForm] = useState({
        title: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        if (!form.title.trim()) {
            setError("Title is required")
            setLoading(false)
            return
        }

        try {
            const res = await fetch(`/api/tasks/${taskId}/next-actions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            if (res.ok) {
                setForm({ title: "" })
                onActionCreated()
            } else {
                const data = await res.json()
                setError(data.error || "Failed to create next action")
            }
        } catch (error) {
            console.error("Error creating next action:", error)
            setError("Something went wrong")
        }

        setLoading(false)
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    return (
        <div className="bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text gray-800 mb-4">
                Add Next Action
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-bold mb-1"
                    >
                        Action Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="What needs to be done next?"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                    {loading ? "Adding..." : "Add Next Action"}
                </button>
            </form>
        </div>
    )
}
export default NextActionForm

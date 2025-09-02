"use client"

import { useState } from "react"

type WorkDoneFormProps = {
    targetType: "task" | "nextAction"
    targetId: string
    onWorkCreated: () => void
}

const WorkDoneForm = ({
    targetType,
    targetId,
    onWorkCreated,
}: WorkDoneFormProps) => {
    const [form, setForm] = useState({
        description: "",
        hoursSpent: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        if (!form.description.trim()) {
            setError("Description is required")
            setLoading(false)
            return
        }

        try {
            const endpoint =
                targetType === "task"
                    ? `/api/tasks/${targetId}/work-done`
                    : `/api/next-actions/${targetId}/work-done`

            const payload = {
                description: form.description,
                hoursSpent: form.hoursSpent
                    ? parseFloat(form.hoursSpent)
                    : null,
            }

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                setForm({ description: "", hoursSpent: "" })
                onWorkCreated()
            } else {
                const data = await res.json()
                setError(data.error || "Failed to log work")
            }
        } catch (error) {
            console.error("Error logging work:", error)
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
        <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Log Work Done
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-bold mb-1"
                    >
                        What did you accomplish? *
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="hoursSpent"
                        className="block text-sm font-bold mb-1"
                    >
                        Hours Spent (Optional)
                    </label>
                    <input
                        type="number"
                        id="hoursSpent"
                        name="hoursSpent"
                        value={form.hoursSpent}
                        onChange={handleChange}
                        step="0.5"
                        min="0"
                        placeholder="2.5"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? "Logging..." : "Log Work Done"}
                </button>
            </form>
        </div>
    )
}
export default WorkDoneForm

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

type TaskDetail = {
    id: string
    title: string
    description: string | null
    dueDate: string | null
    priority: boolean
    status: string
    createdAt: string
    updatedAt: string
    category: {
        id: string
        name: string
    }
}

const TaskDetailPage = () => {
    const [task, setTask] = useState<TaskDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const params = useParams()
    const router = useRouter()
    const { data: session, status } = useSession()

    useEffect(() => {
        if (status === "loading") return
        if (!session) router.push("/signin")
    }, [session, status, router])

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await fetch(`/api/tasks/${params.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setTask(data.task)
                } else {
                    setError("Task not found")
                }
            } catch (err) {
                console.error("Failed to fetch task:", err)
                setError("Failed to load task")
            }
            setLoading(false)
        }

        if (params.id && session) {
            fetchTask()
        }
    }, [params.id, session])

    if (status === "loading" || loading) {
        return <div className="p-6">Loading...</div>
    }

    if (!session) {
        return <div>Redirecting...</div>
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="text-red-500 mb-4">{error}</div>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
                >
                    Go Back
                </button>
            </div>
        )
    }

    if (!task) {
        return <div className="p-6">Task not found</div>
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                    ← Back
                </button>

                <div className="flex gap-2">
                    {task.priority && (
                        <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">
                            HIGH PRIORITY
                        </span>
                    )}
                    <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                            task.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : task.status === "IN_PROGRESS"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                        {task.status.replace("_", " ")}
                    </span>
                </div>
            </div>

            {/* Task Content */}
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {task.title}
                </h1>

                {task.description && (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">
                            Description
                        </h2>
                        <p className="text-gray-600 whitespace-pre-wrap">
                            {task.description}
                        </p>
                    </div>
                )}

                {/* Task Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">
                            Category
                        </h3>
                        <span className="bg-gray-100 px-3 py-1 rounded">
                            {task.category.name}
                        </span>
                    </div>

                    {task.dueDate && (
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">
                                Due Date
                            </h3>
                            <span>
                                {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                        </div>
                    )}

                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">
                            Created
                        </h3>
                        <span>
                            {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">
                            Last Updated
                        </h3>
                        <span>
                            {new Date(task.updatedAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Future sections for next actions and work done */}
                <div className="border-t pt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Next Actions
                    </h2>
                    <p className="text-gray-500 italic">Coming soon...</p>
                </div>

                <div className="border-t pt-8 mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Work Done
                    </h2>
                    <p className="text-gray-500 italic">Coming soon...</p>
                </div>
            </div>
        </div>
    )
}

export default TaskDetailPage

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import NextActionForm from "@/app/components/NextActionForm"
import WorkDoneForm from "@/app/components/WorkDoneForm"
import NextActionCard from "@/app/components/NextActionCard"
import WorkDoneCard from "@/app/components/WorkDoneCard"

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

type NextAction = {
    id: string
    title: string
    completed: boolean
    createdAt: string
    updatedAt: string
}

type WorkDone = {
    id: string
    description: string
    hoursSpent: number | null
    createdAt: string
    updatedAt: string
}

const TaskDetailPage = () => {
    const [workDone, setWorkDone] = useState<WorkDone[]>([])
    const [refreshWork, setRefreshWork] = useState(0)
    const [nextActions, setNextActions] = useState<NextAction[]>([])
    const [refreshActions, setRefreshActions] = useState(0)
    const [task, setTask] = useState<TaskDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const params = useParams()
    const router = useRouter()
    const { data: session, status } = useSession()

    const incompleteActions = nextActions.filter(
        (action) => !action.completed
    ).length
    const totalActions = nextActions.length

    useEffect(() => {
        if (status === "loading") return
        if (!session) router.push("/signin")
    }, [session, status, router])

    useEffect(() => {
        const fetchNextActions = async () => {
            if (!params.id || !session) return

            try {
                const res = await fetch(`/api/tasks/${params.id}/next-actions`)
                if (res.ok) {
                    const data = await res.json()
                    setNextActions(data.nextActions)
                }
            } catch (error) {
                console.error("Failed to fetch next actions:", error)
            }
        }

        fetchNextActions()
    }, [params.id, session, refreshActions])

    const handleActionCreated = () => {
        setRefreshActions((prev) => prev + 1)
    }

    const toggleActionComplete = async (
        actionId: string,
        currentStatus: boolean
    ) => {
        try {
            const res = await fetch(
                `/api/tasks/${params.id}/next-actions/${actionId}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ completed: !currentStatus }),
                }
            )

            if (res.ok) {
                // Update local state instead of refetching all actions
                setNextActions((prevActions) =>
                    prevActions.map((action) =>
                        action.id === actionId
                            ? { ...action, completed: !currentStatus }
                            : action
                    )
                )
            } else {
                console.error("Failed to update next action")
            }
        } catch (error) {
            console.error("Error updating next action:", error)
        }
    }

    useEffect(() => {
        const fetchWorkDone = async () => {
            if (!params.id || !session) return

            try {
                const res = await fetch(`/api/tasks/${params.id}/work-done`)
                if (res.ok) {
                    const data = await res.json()
                    setWorkDone(data.workDone)
                }
            } catch (error) {
                console.error("Failed to fetch work done:", error)
            }
        }
        fetchWorkDone()
    }, [params.id, session, refreshWork])

    const handleWorkCreated = () => {
        setRefreshWork((prev) => prev + 1)
    }

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

                {/* Next Actions & Work Done */}
                <div className="border-t pt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Next Actions{" "}
                        {totalActions > 0 && (
                            <span className="text-sm text-gray-500 ml-2">
                                ({incompleteActions} pending
                                {totalActions > incompleteActions &&
                                    `, ${
                                        totalActions - incompleteActions
                                    } completed`}
                                )
                            </span>
                        )}
                    </h2>

                    {/* Show existing next actions */}
                    {nextActions.length > 0 && (
                        <div className="space-y-3 mb-6">
                            {nextActions.map((action: NextAction) => (
                                <NextActionCard 
                                    key={action.id}
                                    action={action}
                                    onToggleComplete={toggleActionComplete}
                                    showClickHint={true}
                                />
                            ))}
                        </div>
                    )}

                    {/* Add the form */}
                    <NextActionForm
                        taskId={task.id}
                        onActionCreated={handleActionCreated}
                    />
                </div>

                <div className="border-t pt-8 mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Work Done ({workDone.length})
                    </h2>

                    {workDone.length > 0 && (
                        <div className="space-y-3 mb-6">
                            {workDone.map((work) => (
                                <WorkDoneCard 
                                    key={work.id}
                                    work={work}
                                />
                            ))}
                        </div>
                    )}

                    <WorkDoneForm
                        targetType="task"
                        targetId={task.id}
                        onWorkCreated={handleWorkCreated}
                    />
                </div>
            </div>
        </div>
    )
}

export default TaskDetailPage

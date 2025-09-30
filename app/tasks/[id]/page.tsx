"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import NextActionForm from "@/app/components/NextActionForm"
import WorkDoneForm from "@/app/components/WorkDoneForm"
import NextActionCard from "@/app/components/NextActionCard"
import WorkDoneCard from "@/app/components/WorkDoneCard"
import TaskCompletionSection from "@/app/components/TaskCompletionSection"

type TaskDetail = {
    id: string
    title: string
    description: string | null
    dueDate: string | null
    priority: boolean
    status: string
    autoComplete: boolean
    completedAt: string | null
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
    completedAt: string | null
}

type WorkDone = {
    id: string
    description: string
    hoursSpent: number | null
    createdAt: string
    updatedAt: string
}

const TaskDetailPage = () => {
    // Consolidated state
    const [task, setTask] = useState<TaskDetail | null>(null)
    const [nextActions, setNextActions] = useState<NextAction[]>([])
    const [workDone, setWorkDone] = useState<WorkDone[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Refresh triggers
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const params = useParams()
    const router = useRouter()
    const { data: session, status } = useSession()

    // Helper function for completion stats
    const getCompletionStats = () => {
        if (nextActions.length === 0)
            return { percentage: 0, completed: 0, total: 0 }
        const completed = nextActions.filter(
            (action) => action.completed
        ).length
        const total = nextActions.length
        const percentage = Math.round((completed / total) * 100)
        return { percentage, completed, total }
    }

    // Authentication check
    useEffect(() => {
        if (status === "loading") return
        if (!session) router.push("/signin")
    }, [session, status, router])

    // Main data fetching - fetch everything together
    useEffect(() => {
        const fetchAllData = async () => {
            if (status !== "authenticated" || !session || !params.id) return

            setLoading(true)
            setError("")

            try {
                // Fetch all data in parallel
                const [taskRes, actionsRes, workRes] = await Promise.all([
                    fetch(`/api/tasks/${params.id}`),
                    fetch(`/api/tasks/${params.id}/next-actions`),
                    fetch(`/api/tasks/${params.id}/work-done`),
                ])

                if (taskRes.ok) {
                    const taskData = await taskRes.json()
                    setTask(taskData.task)
                } else {
                    setError("Task not found")
                    setLoading(false)
                    return
                }

                if (actionsRes.ok) {
                    const actionsData = await actionsRes.json()
                    setNextActions(actionsData.nextActions)
                }

                if (workRes.ok) {
                    const workData = await workRes.json()
                    setWorkDone(workData.workDone)
                }
            } catch (err) {
                console.error("Failed to fetch data:", err)
                setError("Failed to load task data")
            } finally {
                setLoading(false)
            }
        }

        fetchAllData()
    }, [params.id, session, status, refreshTrigger])

    // Handlers
    const handleRefresh = () => {
        setRefreshTrigger((prev) => prev + 1)
    }

    const toggleActionComplete = async (
        actionId: string,
        currentStatus: boolean
    ) => {
        // Optimistically update UI immediately
        setNextActions((prevActions) =>
            prevActions.map((action) =>
                action.id === actionId
                    ? {
                          ...action,
                          completed: !currentStatus,
                          completedAt: !currentStatus
                              ? new Date().toISOString()
                              : null,
                      }
                    : action
            )
        )

        try {
            const res = await fetch(`/api/next-actions/${actionId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: !currentStatus }),
            })

            if (res.ok) {
                const updatedNextAction = await res.json()
                console.log("Updated next action:", updatedNextAction) // Debug log

                // Update with the actual response data (includes proper completedAt)
                setNextActions((prevActions) =>
                    prevActions.map((action) =>
                        action.id === actionId
                            ? {
                                  ...action,
                                  completed: updatedNextAction.completed,
                                  completedAt: updatedNextAction.completedAt,
                              }
                            : action
                    )
                )

                // If auto-complete is enabled and we just completed the last action,
                // check if task should be auto-completed
                if (!currentStatus && task?.autoComplete) {
                    const updatedActions = nextActions.map((action) =>
                        action.id === actionId
                            ? { ...action, completed: true }
                            : action
                    )
                    const allCompleted = updatedActions.every(
                        (action) => action.completed
                    )

                    if (allCompleted) {
                        // Optimistically update task status
                        setTask((prev) =>
                            prev
                                ? {
                                      ...prev,
                                      status: "COMPLETED",
                                      completedAt: new Date().toISOString(),
                                  }
                                : null
                        )
                    }
                }
            } else {
                // Revert optimistic update on failure
                setNextActions((prevActions) =>
                    prevActions.map((action) =>
                        action.id === actionId
                            ? {
                                  ...action,
                                  completed: currentStatus, // Revert
                                  completedAt: currentStatus
                                      ? new Date().toISOString()
                                      : null,
                              }
                            : action
                    )
                )
                console.error("Failed to update next action")
            }
        } catch (error) {
            // Revert optimistic update on error
            setNextActions((prevActions) =>
                prevActions.map((action) =>
                    action.id === actionId
                        ? {
                              ...action,
                              completed: currentStatus, // Revert
                              completedAt: currentStatus
                                  ? new Date().toISOString()
                                  : null,
                          }
                        : action
                )
            )
            console.error("Error updating next action:", error)
        }
    }

    // Loading states
    if (status === "loading" || loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!session) {
        return <div>Redirecting...</div>
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="text-red-800 font-semibold mb-2">Error</div>
                    <div className="text-red-600 mb-4">{error}</div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!task) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">Task not found</div>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => router.push("/dashboard")}
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

                    {task.completedAt && (
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">
                                Completed
                            </h3>
                            <span className="text-green-600">
                                {new Date(
                                    task.completedAt
                                ).toLocaleDateString()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Task Completion Section */}
                <TaskCompletionSection
                    task={{
                        id: task.id,
                        status: task.status,
                        autoComplete: task.autoComplete,
                    }}
                    nextActionsCount={nextActions.length}
                    completedActionsCount={
                        nextActions.filter((action) => action.completed).length
                    }
                    onTaskUpdated={handleRefresh}
                />

                {/* Next Actions */}
                <div className="border-t pt-8">
                    {(() => {
                        const { percentage, completed, total } =
                            getCompletionStats()
                        return (
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Next Actions (
                                        {
                                            nextActions.filter(
                                                (action) => !action.completed
                                            ).length
                                        }
                                        )
                                    </h2>
                                    {total > 0 && (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-20 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-600 font-medium">
                                                {percentage}% ({completed}/
                                                {total})
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })()}

                    {nextActions.length > 0 && (
                        <div className="space-y-3 mb-6">
                            {nextActions.map((action) => (
                                <NextActionCard
                                    key={action.id}
                                    action={action}
                                    onToggleComplete={toggleActionComplete}
                                    showClickHint={true}
                                />
                            ))}
                        </div>
                    )}

                    <NextActionForm
                        taskId={task.id}
                        onActionCreated={handleRefresh}
                    />
                </div>

                {/* Work Done */}
                <div className="border-t pt-8 mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Work Done ({workDone.length})
                    </h2>

                    {workDone.length > 0 && (
                        <div className="space-y-3 mb-6">
                            {workDone.map((work) => (
                                <WorkDoneCard key={work.id} work={work} onClick={() => router.push(`/work-done/${work.id}`)}/>
                            ))}
                        </div>
                    )}

                    <WorkDoneForm
                        targetType="task"
                        targetId={task.id}
                        onWorkCreated={handleRefresh}
                    />
                </div>
            </div>
        </div>
    )
}

export default TaskDetailPage

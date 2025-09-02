"use client"

import { useState } from "react"

type TaskCompletionSectionProps = {
    task: {
        id: string
        status: string
        autoComplete: boolean
    }
    nextActionsCount: number
    completedActionsCount: number
    onTaskUpdated: () => void
}

const TaskCompletionSection = ({
    task,
    nextActionsCount,
    completedActionsCount,
    onTaskUpdated,
}: TaskCompletionSectionProps) => {
    const [loading, setLoading] = useState(false)
    const isCompleted = task.status === "COMPLETED"
    const hasNextActions = nextActionsCount > 0
    const allActionsCompleted =
        hasNextActions && completedActionsCount === nextActionsCount

    const updateTask = async (updates: {
        status?: string
        autoComplete?: boolean
    }) => {
        setLoading(true)

        try {
            const res = await fetch(`/api/tasks/${task.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            })

            if (res.ok) {
                onTaskUpdated()
            }
        } catch (error) {
            console.error("Error updating task:", error)
        }
        setLoading(false)
    }

    const toggleTaskCompletion = () => {
        const newStatus = isCompleted ? "PENDING" : "COMPLETED"
        updateTask({ status: newStatus })
    }

    const toggleAutoComplete = () => {
        updateTask({ autoComplete: !task.autoComplete })
    }

    return (
        <div className="border-t pt-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Task Completion
            </h2>

            <div className="bg-gray-50 p-6 rounded-lg">
                {/* Manual completion for tasks without next actions */}
                {!hasNextActions && (
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-1">
                                Mark Task Complete
                            </h3>
                            <p className="text-sm text-gray-600">
                                This task has no next actions. You can manually
                                mark it as complete.
                            </p>
                        </div>
                        <button
                            onClick={toggleTaskCompletion}
                            disabled={loading}
                            className={`px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 ${
                                isCompleted
                                    ? "bg-yellow-600 text-white hover:bg-yellow-700"
                                    : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                        >
                            {loading
                                ? "Updating..."
                                : isCompleted
                                ? "Mark Incomplete"
                                : "Mark Complete"}
                        </button>
                    </div>
                )}

                {/* Auto-completion settings for tasks with next actions */}
                {hasNextActions && (
                    <div className="space-y-4">
                        {/* Auto-complete toggle */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-1">
                                    Auto-Complete
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Automatically mark this task complete when
                                    all next actions are finished.
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={task.autoComplete}
                                    onChange={toggleAutoComplete}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* Status indicator */}
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-1">
                                        Current Status
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {completedActionsCount} of{" "}
                                        {nextActionsCount} next actions
                                        completed
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span
                                        className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                                            isCompleted
                                                ? "bg-green-100 text-green-800"
                                                : allActionsCompleted
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {isCompleted
                                            ? "COMPLETED"
                                            : allActionsCompleted
                                            ? "READY TO COMPLETE"
                                            : "IN PROGRESS"}
                                    </span>
                                </div>
                            </div>

                            {/* Manual completion when all actions are done but auto-complete is off */}
                            {allActionsCompleted &&
                                !task.autoComplete &&
                                !isCompleted && (
                                    <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-blue-800">
                                                All next actions are complete!
                                                Ready to finish this task?
                                            </span>
                                            <button
                                                onClick={toggleTaskCompletion}
                                                disabled={loading}
                                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {loading
                                                    ? "Updating..."
                                                    : "Complete Task"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default TaskCompletionSection

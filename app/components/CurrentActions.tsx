"use client"

import { useEffect, useState } from "react"
import { Task } from "../types/task"

import TaskCard from "./TaskCard"
import ConfirmationModal from "./ConfirmationModal"

const CurrentActions = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
    const tasksPerPage = 4

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch("/api/tasks")
                if (res.ok) {
                    const data = await res.json()
                    setTasks(data.tasks)
                }
            } catch (error) {
                console.log("Failed to fetch tasks:", error)
                setError("Failed to load tasks. Please try again.")
            }
            setLoading(false)
        }

        fetchTasks()
    }, [])

    const taskBeingDeleted = taskToDelete ? tasks.find(t => t.id === taskToDelete) : null

    // Update deleteTask to show confirmation
    const deleteTask = (taskId: string) => {
        setTaskToDelete(taskId)
    }

    // Actual deletion function
    const confirmDelete = async () => {
        if (!taskToDelete) return

        try {
            const res = await fetch(`/api/tasks/${taskToDelete}`, {
                method: "DELETE",
            })

            if (res.ok) {
                // Remove task from state
                setTasks(tasks.filter((task) => task.id !== taskToDelete))
                setTaskToDelete(null)
            } else {
                setError("Failed to delete task")
            }
        } catch (error) {
            console.error("Failed to delete task:", error)
            setError("Failed to delete task")
        }
    }

    const cancelDelete = () => {
        setTaskToDelete(null)
    }

    const completeTask = async (taskId: string) => {
        try {
            const res = await fetch(`/api/tasks/${taskId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "COMPLETED" }),
            })

            if (res.ok) {
                // Update task status in state
                setTasks(
                    tasks.map((task) =>
                        task.id === taskId
                            ? { ...task, status: "COMPLETED" }
                            : task
                    )
                )
            } else {
                setError("Failed to complete task")
            }
        } catch (error) {
            console.error("Failed to complete task:", error)
            setError("Failed to complete task")
        }
    }

    // Calculate pagination
    const totalPages = Math.ceil(tasks.length / tasksPerPage)
    const startIndex = (currentPage - 1) * tasksPerPage
    const endIndex = startIndex + tasksPerPage
    const currentTasks = tasks.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    if (loading) return <div>Loading tasks...</div>

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-2xl">
                    Current Tasks ({tasks.length})
                </h2>
                {totalPages > 1 && (
                    <span className="text-gray-500 text-sm">
                        Page {currentPage} of {totalPages}
                    </span>
                )}
            </div>

            {tasks.length === 0 ? (
                <p>No tasks yet. Create your first task!</p>
            ) : (
                <>
                    <div className="space-y-4 mb-6">
                        {error && <div className="text-red-500">{error}</div>}
                        {currentTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onDelete={deleteTask}
                                onComplete={completeTask}
                            />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2">
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                            >
                                Previous
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1
                            ).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 rounded border ${
                                        currentPage === page
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-gray-100"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            <ConfirmationModal 
                isOpen={!!taskToDelete}
                title="Confirm Delete"
                message={
                    taskBeingDeleted
                    ? `Are you sure you want to delete "${taskBeingDeleted.title}"? This action cannot be undone.`
                    : "Are you sure you want to delete this task? This action cannot be undone."
                }
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                variant="danger"
            />
        </div>
    )
}

export default CurrentActions

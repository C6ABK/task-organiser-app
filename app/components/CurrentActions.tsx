"use client"

import { useEffect, useState } from "react"

type Task = {
    id: string
    title: string
    description: string | null
    dueDate: string | null
    priority: boolean
    status: string
    category: {
        name: string
    }
}

const CurrentActions = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
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
            }
            setLoading(false)
        }

        fetchTasks()
    }, [])

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
                <h2 className="font-bold text-2xl">Current Tasks ({tasks.length})</h2>
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
                        {currentTasks.map((task) => (
                            <div
                                key={task.id}
                                className="border p-4 rounded hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">
                                        {task.title}
                                    </h3>
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

                                {task.description && (
                                    <p className="text-gray-600 mb-3">
                                        {task.description}
                                    </p>
                                )}

                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span className="bg-gray-100 px-2 py-1 rounded">
                                        {task.category.name}
                                    </span>
                                    {task.dueDate && (
                                        <span>
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                            >
                                Previous
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default CurrentActions
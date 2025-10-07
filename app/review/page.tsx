"use client"

import { useEffect, useState } from "react"
import { Task } from "../types"

const ReviewPage = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [currentIdx, setCurrentIdx] = useState(0)
    const [loading, setLoading] = useState(true)
    const [reviewDate, setReviewDate] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        // Fetch tasks due for review today or overdue
        const fetchTasksForReview = async () => {
            setLoading(true)
            try {
                const res = await fetch("/api/tasks/review")
                const data = await res.json()
                setTasks(data)
            } catch (error) {
                setError("Failed to load tasks." + error)
            }
            setLoading(false)
        }
        fetchTasksForReview()
    }, [])

    const currentTask = tasks[currentIdx]
    const nextActions = []
    const workDone = []

    const handleReviewDateChange = async (e : React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value
        const today = new Date().toISOString().slice(0, 10)
        if (newDate < today) {
            setError("Review date cannot be in the past.")
            return
        }
        setError("")
        setReviewDate(newDate)

        // Call API to updte review date for currentTask.id
        await fetch(`/api/tasks/${currentTask.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reviewOn: newDate }),
        })

        // Update local state
        setTasks((prev) =>
            prev.map((t, idx) =>
                idx === currentIdx ? { ...t, reviewOn: newDate } : t
            )
        )
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Daily Review</h1>
            {loading ? (
                <div>Loading...</div>
            ) : tasks.length === 0 ? (
                <div>No tasks to review today!</div>
            ) : (
                <div>
                    <div className="mb-2 text-sm text-gray-500">
                        Task {currentIdx + 1} of {tasks.length}
                    </div>
                    <div className="bg-gray-50 p-4 rounded shadow mb-4">
                        <div className="font-semibold">{currentTask.title}</div>
                        <div className="text-sm text-gray-600">
                            {currentTask.description}
                        </div>
                        <div className="text-xs text-gray-400 mb-2">
                            Review On:{" "}
                            {currentTask.reviewOn
                                ? new Date(
                                      currentTask.reviewOn
                                  ).toLocaleDateString()
                                : ""}
                        </div>
                        <label className="block text-xs mb-1">
                            Edit Review Date:
                        </label>
                        <input
                            type="date"
                            value={
                                reviewDate ||
                                currentTask.reviewOn?.slice(0, 10) ||
                                ""
                            }
                            min={new Date().toISOString().slice(0, 10)}
                            onChange={handleReviewDateChange}
                            className="border px-2 py-1 rounded"
                        />
                        {error && (
                            <div className="text-red-500 text-xs mt-1">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Next Actions */}
                    <div className="mb-4">
                        <h2 className="font-bold text-lg mb-2">Next Actions</h2>
                        {/* Render nextActions here */}
                        {/* Add new next action form here */}
                    </div>
                    {/* Work Done */}
                    <div className="mb-4">
                        <h2 className="font-bold text-lg mb-2">Work Done</h2>
                        {/* Render workDone here */}
                        {/* Add new work done form here */}
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-2 mt-4">
                        <button
                            disabled={currentIdx === 0}
                            onClick={() =>
                                setCurrentIdx((idx) => Math.max(0, idx - 1))
                            }
                            className="px-3 py-1 rounded bg-gray-200 cursor-pointer"
                        >
                            Previous
                        </button>
                        <button
                            disabled={currentIdx === tasks.length - 1}
                            onClick={() =>
                                setCurrentIdx((idx) =>
                                    Math.min(tasks.length - 1, idx + 1)
                                )
                            }
                            className="px-3 py-1 rounded bg-gray-200 cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
export default ReviewPage

"use client"

import { useEffect, useState } from "react"

const ReviewPage = () => {
    const [tasks, setTasks] = useState([])
    const [currendtIdx, setCurrentIdx] = useState(0)
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
                setError("Failed to load tasks.")
            }
            setLoading(false)
        }
        fetchTasksForReview()
    }, [])

    const currentTask = tasks[currendtIdx]
    const nextActions = []
    const workDone = []

    const handleReviewDateChange = async (e) => {
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
            body: JSON.stringify({ reviewOn: newDate })
        })

        // Update local state
        setTasks(prev =>
            prev.map((t, idx) =>
                idx === currentIdx ? { ...t, reviewOn: newDate } : t
            )
        )
    }

    return <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Daily Review</h1>
        {loading ? (
            <div>Loading...</div>
        ) : tasks.length === 0 ? (
            <div>No tasks to review today!</div>
        ) : (
            <div>
                <div className="mb-2 text-sm text-gray-500">
                    Task {currendtIdx + 1} of {tasks.length}
                </div>
                <div className="bg-gray-50 p-4 rounded shadow mb-4">
                    <div className="font-semibold">{currentTask.title}</div>
                    <div className="text-sm text-gray-600">{currentTask.description}</div>
                    <div className="text-xs text-gray-400 mb-2">
                        Review On: {currentTask.reviewOn ? new Date(currentTask.reviewOn).toLocaleDateString() : ""}
                    </div>
                    <label className="block text-xs mb-1">Edit Review Date:</label>
                    <input type="date" 
                    value={reviewDate || currentTask.reviewOn?.slice(0, 10) || "" } />
                </div>
            </div>
        )}
    </div>
}
export default ReviewPage

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import ConfirmationModal from "@/app/components/ConfirmationModal" // Add this import

interface WorkDone {
    id: string
    description: string
    completedAt: string
    taskId: string
    task: {
        title: string
    }
}

const WorkDoneDetailPage = ({ params }: { params: { id: string } }) => {
    const [workDone, setWorkDone] = useState<WorkDone | null>(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [editDescription, setEditDescription] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showDeleteModal, setShowDeleteModal] = useState(false) // Add this state

    const router = useRouter()
    const { data: session, status } = useSession()

    // Authentication Check
    useEffect(() => {
        if (status === "loading") return
        if (!session) {
            router.push("/signin")
        }
    }, [session, status, router])

    // Fetch work done details
    useEffect(() => {
        if (!session) return

        const fetchWorkDone = async () => {
            try {
                const response = await fetch(`/api/work-done/${params.id}`)
                if (response.ok) {
                    const data = await response.json()
                    setWorkDone(data)
                    setEditDescription(data.description)
                } else {
                    setError("Work done item not found")
                }
            } catch (error) {
                console.error("Error fetching work done:", error)
                setError("Failed to load work done items")
            } finally {
                setLoading(false)
            }
        }

        fetchWorkDone()
    }, [params.id, session])

    const handleEdit = async () => {
        if (!editDescription.trim()) {
            setError("Description cannot be empty")
            return
        }

        setLoading(true)
        setError("")

        try {
            const response = await fetch(`/api/work-done/${params.id}`, {
                method: "PATCH", // Change to PATCH
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description: editDescription.trim() }),
            })

            if (response.ok) {
                const updatedWorkDone = await response.json()
                setWorkDone(updatedWorkDone)
                setEditing(false)
                setSuccess("Work done updated successfully")
                setTimeout(() => setSuccess(""), 3000)
            } else {
                setError("Failed to update work done item")
            }
        } catch (error) {
            console.error("Error updating work done:", error)
            setError("Failed to update work done item")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        setShowDeleteModal(false) // Close modal first
        setLoading(true)

        try {
            const response = await fetch(`/api/work-done/${params.id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                router.push(`/tasks/${workDone?.taskId}`)
            } else {
                setError("Failed to delete work done item")
            }
        } catch (error) {
            console.error("Error deleting work done:", error)
            setError("Failed to delete work done item")
        } finally {
            setLoading(false)
        }
    }

    const cancelEdit = () => {
        setEditing(false)
        setEditDescription(workDone?.description || "")
        setError("")
    }

    // Loading state
    if (status === "loading" || loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    </div>
                </div>
            </div>
        )
    }

    // Redirect if not authenticated
    if (!session) {
        return <div>Redirecting to sign in...</div>
    }

    // Error or not found
    if (!workDone) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Work Done Item Not Found
                    </h1>
                    <p className="text-gray-600 mb-6">
                        This work done item does not exist or you do not have
                        permission to view it.
                    </p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <button
                        onClick={() => router.push(`/tasks/${workDone.taskId}`)}
                        className="hover:text-gray-700"
                    >
                        {workDone.task.title}
                    </button>
                    <span className="mx-2">→</span>
                    <span>Work Done</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Work Done Details
                </h1>
            </div>

            {/* Messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6">
                    {success}
                </div>
            )}

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Completed Work
                    </h2>
                    <div className="flex items-center space-x-2">
                        {!editing ? (
                            <>
                                <button
                                    onClick={() => setEditing(true)}
                                    className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                                    disabled={loading}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(true)} // Show modal instead
                                    className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                                    disabled={loading}
                                >
                                    Delete
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleEdit}
                                    className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                                    disabled={
                                        loading || !editDescription.trim()
                                    }
                                >
                                    Save
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Description
                    </label>
                    {editing ? (
                        <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Describe what work was completed..."
                        />
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                            <p className="text-gray-800 whitespace-pre-wrap">
                                {workDone.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Metadata */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">
                                Completed:
                            </span>
                            <span className="ml-2 text-gray-600">
                                {new Date(
                                    workDone.completedAt
                                ).toLocaleString()}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">
                                Task:
                            </span>
                            <button
                                onClick={() =>
                                    router.push(`/tasks/${workDone.taskId}`)
                                }
                                className="ml-2 text-blue-600 hover:text-blue-800 underline"
                            >
                                {workDone.task.title}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {showDeleteModal && (
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    title={"Delete Work Done"}
                    message={`Are you sure you want to delete this work? This cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                    variant="danger"
                />
            )}
        </div>
    )
}

export default WorkDoneDetailPage

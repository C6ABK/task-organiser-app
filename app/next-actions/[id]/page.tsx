"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import WorkDoneForm from "@/app/components/WorkDoneForm"
import ConfirmationModal from "@/app/components/ConfirmationModal"
import WorkDoneCard from "@/app/components/WorkDoneCard"
import next from "next"

type NextActionDetail = {
    id: string
    title: string
    completed: boolean
    createdAt: string
    updatedAt: string
    completedAt: string | null
    task: {
        id: string
        title: string
    }
}

type WorkDone = {
    id: string
    description: string
    hoursSpent: number | null
    createdAt: string
}

const NextActionDetailPage = () => {
    const [nextAction, setNextAction] = useState<NextActionDetail | null>(null)
    const [workDone, setWorkDone] = useState<WorkDone[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [refreshWork, setRefreshWork] = useState(0)
    const params = useParams()
    const router = useRouter()
    const { data: session, status } = useSession()
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const handleDelete = async () => {
        if (!nextAction) return

        try {
            const res = await fetch(`/api/next-actions/${nextAction.id}`, {
                method: "DELETE",
            })

            if (res.ok) {
                router.push(`/tasks/${nextAction.task.id}`)
            } else {
                console.error("Failed to delete next action")
            }
        } catch (error) {
            console.error("Error deleting next action:", error)
        }
    }

    useEffect(() => {
        if (status === "loading") return
        if (!session) router.push("/signin")
    }, [session, status, router])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [actionRes, workRes] = await Promise.all([
                    fetch(`/api/next-actions/${params.id}`),
                    fetch(`/api/next-actions/${params.id}/work-done`),
                ])

                if (actionRes.ok) {
                    const actionData = await actionRes.json()
                    setNextAction(actionData.nextAction)
                } else {
                    setError("Next action not found")
                }

                if (workRes.ok) {
                    const workData = await workRes.json()
                    setWorkDone(workData.workDone)
                }
            } catch (error) {
                console.error("Failed to fetch data:", error)
                setError("Failed to load data")
            }
            setLoading(false)
        }

        if (params.id && session) {
            fetchData()
        }
    }, [params.id, session, refreshWork])

    const toggleComplete = async () => {
        if (!nextAction) return

        try {
            const res = await fetch(`/api/next-actions/${nextAction.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: !nextAction.completed }),
            })

            if (res.ok) {
                setNextAction((prev) =>
                    prev ? { ...prev, completed: !prev.completed } : null
                )
            }
        } catch (error) {
            console.error("Error updating next action:", error)
        }
    }

    const handleWorkCreated = () => {
        setRefreshWork((prev) => prev + 1)
    }

    if (status === "loading" || loading) {
        return <div className="p-6">Loading...</div>
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="text-red-500 mb-4">{error}</div>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Go Back
                </button>
            </div>
        )
    }

    if (!nextAction) return <div className="p-6">Next action not found</div>

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                    ← Back to {nextAction.task.title}
                </button>

                <div className="flex items-center gap-3">
                    <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                            nextAction.completed
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                        {nextAction.completed ? "COMPLETED" : "PENDING"}
                    </span>

                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-sm cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Next action content */}
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center space-x-4 mb-6">
                    <input
                        type="checkbox"
                        checked={nextAction.completed}
                        onChange={toggleComplete}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <h1
                        className={`text-3xl font-bold text-gray-900 ${
                            nextAction.completed
                                ? "line-through text-gray-500"
                                : ""
                        }`}
                    >
                        {nextAction.title}
                    </h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">
                            Part of Task
                        </h3>
                        <button
                            onClick={() =>
                                router.push(`/tasks/${nextAction.task.id}`)
                            }
                            className="text-blue-500 hover:text-blue-800 hover:underline"
                        >
                            {nextAction.task.title}
                        </button>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">
                            Created
                        </h3>
                        <span>
                            {new Date(
                                nextAction.createdAt
                            ).toLocaleDateString()}
                        </span>
                    </div>

                    {nextAction.completedAt && (
                        <div>
                            <h3 className="font-semibold text-gray-600 mb-2">Completed</h3>
                            <span className="text-green-600">
                                {new Date(nextAction.completedAt).toLocaleDateString()}
                            </span>
                        </div>
                    )}

                    {nextAction.completedAt && (
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">Duration</h3>
                            <span className="text-gray-600">
                                {Math.ceil(
                                    (new Date(nextAction.completedAt).getTime() - new Date(nextAction.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                                )} days
                            </span>
                        </div>
                    )}
                </div>

                {/* Work done section */}
                <div className="border-t pt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Work Done({workDone.length})
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
                        targetType="nextAction"
                        targetId={nextAction.id}
                        onWorkCreated={handleWorkCreated}
                    />
                </div>
            </div>
            <ConfirmationModal 
                isOpen={showDeleteModal}
                title={"Delete Next Action"}
                message={`Are you sure you want to delete "${nextAction.title}"? This will also delete all associated work done entries. This cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
                variant="danger"
            />
        </div>
    )
}
export default NextActionDetailPage

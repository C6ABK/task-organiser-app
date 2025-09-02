"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import CreateTask from "../components/CreateTask"
import { Task } from "../types"

const BulkOperationsPage = () => {
    const [nextActionsText, setNextActionsText] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const { data: session, status } = useSession()
    const router = useRouter()

    // Authentication check with useEffect to avoid SSR issues
    useEffect(() => {
        if (status === "loading") return
        if (!session) {
            router.push("/signin")
        }
    }, [session, status, router])

    // Parse bullet points into actions
    const parseNextActions = (text: string): string[] => {
        if (!text.trim()) return []

        return text
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .map((line) => {
                // Remove common bullet point prefixes
                return line.replace(/^[-•*+]\s*/, "").trim()
            })
            .filter((line) => line.length > 0)
    }

    const handleTaskCreated = async (task: Task) => {
        const nextActions = parseNextActions(nextActionsText)

        // If no next actions, just redirect to task
        if (nextActions.length === 0) {
            setSuccess("✅ Task created successfully!")
            setTimeout(() => router.push(`/tasks/${task.id}`), 1500)
            return
        }

        setLoading(true)
        setError("")

        try {
            // Create all next actions in parallel
            const actionPromises = nextActions.map((actionTitle) =>
                fetch(`/api/tasks/${task.id}/next-actions`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title: actionTitle }),
                })
            )

            const actionResults = await Promise.all(actionPromises)
            const successfulActions = actionResults.filter((res) => res.ok)
            const failedActions = actionResults.filter((res) => !res.ok)

            if (failedActions.length > 0) {
                setError(
                    `Task created but ${failedActions.length} actions failed to create`
                )
            } else {
                setSuccess(
                    `✅ Task created successfully with ${successfulActions.length} next actions!`
                )
            }

            // Reset next actions text
            setNextActionsText("")

            // Redirect to the new task after a delay
            setTimeout(() => {
                router.push(`/tasks/${task.id}`)
            }, 2000)
        } catch (err) {
            console.error("Error creating next actions:", err)
            setError("Task created but next actions failed to create")
        }

        setLoading(false)
    }

    // Show loading while checking authentication
    if (status === "loading") {
        return (
            <div className="max-w-6xl mx-auto p-6">
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

    // Show redirecting while navigating to signin
    if (!session) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">
                        Redirecting to sign in...
                    </div>
                </div>
            </div>
        )
    }

    const previewActions = parseNextActions(nextActionsText)

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Bulk Task Creation
                        </h1>
                        <p className="text-gray-600">
                            Create a task and add multiple next actions at once
                            by pasting them as a list.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>

            {/* Error/Success Messages */}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                

                {/* Next Actions Section */}
                <div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Next Actions
                        </h2>

                        <div className="mb-4">
                            <label
                                htmlFor="nextActions"
                                className="block text-sm font-bold mb-2"
                            >
                                Actions List (Optional)
                            </label>
                            <textarea
                                id="nextActions"
                                value={nextActionsText}
                                onChange={(e) =>
                                    setNextActionsText(e.target.value)
                                }
                                rows={12}
                                disabled={loading}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                placeholder={`Paste your next actions here, one per line:

- Set up project repository
- Design database schema
- Create wireframes
• Write project documentation
* Schedule team meeting

Bullet points are optional - each line becomes an action.

Leave empty to create just the task.`}
                            />
                        </div>

                        {/* Preview */}
                        {previewActions.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                    Preview ({previewActions.length} actions):
                                </h3>
                                <div className="bg-white border rounded p-3 max-h-60 overflow-y-auto">
                                    <ul className="space-y-2">
                                        {previewActions.map((action, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start text-sm text-gray-700"
                                            >
                                                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded text-xs flex items-center justify-center mr-2 font-medium mt-0.5 flex-shrink-0">
                                                    {index + 1}
                                                </span>
                                                <span className="flex-1">
                                                    {action}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {previewActions.length === 0 &&
                            nextActionsText.trim() && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                                    <p className="text-sm text-yellow-700">
                                        No actions detected. Make sure each
                                        action is on a separate line.
                                    </p>
                                </div>
                            )}
                    </div>
                </div>
                {/* Task Creation Form */}
                <div>
                    <CreateTask
                        onTaskCreated={handleTaskCreated}
                        showTitle={true}
                        submitButtonText={
                            loading ? "Creating..." : "Create Task & Actions"
                        }
                    />
                </div>
            </div>
        </div>
    )
}

export default BulkOperationsPage

"use client"

import { useRouter } from "next/navigation"

type NextActionCardProps = {
    action: {
        id: string
        title: string
        completed: boolean
        createdAt: string
        completedAt: string | null
    }
    onToggleComplete: (actionId: string, currentStatus: boolean) => void
    showClickHint?: boolean
}

const NextActionCard = ({
    action,
    onToggleComplete,
    showClickHint = true,
}: NextActionCardProps) => {
    const router = useRouter()

    return (
        <div
            className={`bg-gray-50 p-4 rounded border-l-4 border-blue-500 transition-shadow ${
                showClickHint ? "cursor-pointer hover:shadow-md" : ""
            }`}
            onClick={() =>
                showClickHint && router.push(`/next-actions/${action.id}`)
            }
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={action.completed}
                        onClick={(e) => {
                            e.stopPropagation() // Prevent navigation when clicking checkbox
                            onToggleComplete(action.id, action.completed)
                        }}
                        onChange={() => {}} // Empty onChange to avoid React warnings
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <h4
                        className={`font-semibold ${
                            action.completed ? "line-through text-gray-500" : ""
                        }`}
                    >
                        {action.title}
                    </h4>
                </div>
                <span
                    className={`text-xs px-2 py-1 rounded ${
                        action.completed
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                    {action.completed ? "COMPLETED" : "PENDING"}
                </span>
            </div>
            <div className="ml-7">
                <span className="text-gray-400 text-xs">
                    {new Date(action.createdAt).toLocaleDateString()}
                    {action.completedAt && (
                        <span className="ml-3 text-green-600">
                            Completed: {new Date(action.completedAt).toLocaleDateString()}
                        </span>
                    )}
                </span>
            </div>
        </div>
    )
}

export default NextActionCard

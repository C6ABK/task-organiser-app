import { Task } from "../types/task"

type TaskCardProps = {
    task: Task
    onDelete?: (taskId: string) => void
    onComplete?: (taskId: string) => void
}

const TaskCard = ({ task, onDelete, onComplete }: TaskCardProps) => {
    const handleDelete = () => {
        if (onDelete) {
            onDelete(task.id)
        }
    }

    const handleComplete = () => {
        if (onComplete) {
            onComplete(task.id)
        }
    }

    return (
        <div className="border p-4 rounded hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{task.title}</h3>
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
                <p className="text-gray-600 mb-3">{task.description}</p>
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

            <div className="flex justify-between gap-2 mt-4">
                <span className="text-sm text-gray-500">
                    Review On: {new Date(task.reviewOn).toLocaleDateString()}
                </span>
                <div className="space-x-4">
                    {task.status !== "COMPLETED" && (
                        <button
                            onClick={handleComplete}
                            className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors cursor-pointer"
                        >
                            ✓ Complete
                        </button>
                    )}
                    <button
                        onClick={handleDelete}
                        className="px-3 py-1 text-xs bg-red-100 text-red-800 roudned hover:bg-red-200 transition-colors cursor-pointer"
                    >
                        ✗ Delete
                    </button>
                </div>
            </div>
        </div>
    )
}
export default TaskCard

"use client"

type WorkDoneCardProps = {
    work: {
        id: string
        description: string
        hoursSpent: number | null
        createdAt: string
    }
    showActions?: boolean
    onDelete?: (workId: string) => void
}

const WorkDoneCard = ({
    work,
    showActions = false,
    onDelete,
}: WorkDoneCardProps) => {
    return (
        <div className="bg-gray-50 p-4 rounded border-l-4 border-green-500">
            <div className="flex justify-between items-start mb-2">
                <p className="text-gray-800 flex-1">{work.description}</p>
                {showActions && onDelete && (
                    <button
                        onClick={() => onDelete(work.id)}
                        className="ml-3 text-red-500 hover:text-red-700 text-sm"
                    >
                        ✕
                    </button>
                )}
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">
                    {new Date(work.createdAt).toLocaleDateString()}
                </span>
                {work.hoursSpent && (
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {work.hoursSpent}h
                    </span>
                )}
            </div>
        </div>
    )
}

export default WorkDoneCard
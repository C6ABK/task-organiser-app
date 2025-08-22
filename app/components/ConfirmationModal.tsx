type ConfirmationModalProps = {
    isOpen: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    onCancel: () => void
    variant?: "danger" | "warning" | "info"
}

const ConfirmationModal = ({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    variant = "danger",
}: ConfirmationModalProps) => {
    if (!isOpen) return null

    const getVariantStyles = () => {
        switch (variant) {
            case "danger":
                return "bg-red-600 hover:bg-red-700 text-white"
            case "warning":
                return "bg-yellow-600 hover:bg-yellow-700 text-white"
            case "info":
                return "bg-blue-600 hover:bg-blue-700 text-white"
            default:
                return "bg-red-600 hover:bg-red-700 text-white"
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-4">
                <h3 className="text-lg font-bold mb-4">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50 cursor-pointer"
                    >
                        {cancelText}
                    </button>
                    <button onClick={onConfirm} className={`px-4 py-2 rounded cursor-pointer ${getVariantStyles()}`}>{confirmText}</button>
                </div>
            </div>
        </div>
    )
}
export default ConfirmationModal

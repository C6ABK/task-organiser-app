export type Task = {
    id: string
    title: string
    description: string | null
    reviewOn: string
    dueDate: string | null
    priority: boolean
    status: string
    createdAt: string
    updatedAt: string
    category: {
        id: string
        name: string
    }
}
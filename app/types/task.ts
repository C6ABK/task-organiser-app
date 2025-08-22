export type Task = {
    id: string
    title: string
    description: string | null
    reviewOn: string
    dueDate: string | null
    priority: boolean
    status: string
    category: {
        name: string
    }
}
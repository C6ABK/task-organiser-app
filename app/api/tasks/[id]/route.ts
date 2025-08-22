import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    try {
        await prisma.task.delete({
            where: {
                id: id,
                userId: session.user.id
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting task:", error)
        return NextResponse.json({ error: "Failed to delete task "}, { status: 500 })    
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorised"}, { status: 401 })
    }

    try {
        const { status } = await request.json()

        const updatedTask = await prisma.task.update({
            where: {
                id: id,
                userId: session.user.id
            },
            data: { status },
            include: { category: true }
        })

        return NextResponse.json({ task: updatedTask })
    } catch (error) {
        console.error("Error updating task:", error)
        return NextResponse.json({ error: "Failed to update task"}, {status: 500})
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorised "}, { status: 401 })
    }

    try {
        const task = await prisma.task.findUnique({
            where: {
                id: id,
                userId: session.user.id
            },
            include: {
                category: true
            }
        })

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 })
        }

        return NextResponse.json({ task })
    } catch (error) {
        console.error("Error fetching task:", error)
        return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
    }
}
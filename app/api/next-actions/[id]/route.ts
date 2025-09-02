import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id }= await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorised "}, { status: 401 })
    }

    try {
        const nextAction = await prisma.nextAction.findUnique({
            where: {id},
            include: {
                task: {
                    select: {
                        id: true,
                        title: true,
                        userId: true
                    }
                }
            }
        })

        if (!nextAction || nextAction.task.userId !== session.user.id) {
            return NextResponse.json({ error: "Next action not found" }, { status: 404})
        }

        return NextResponse.json({ nextAction })
    } catch (error) {
        console.error("Error fetching next action:", error)
        return NextResponse.json(
            { error: "Failed to fetch next action"},
            { status: 500 }
        )       
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string; actionId: string }>}
) {
    const { id, actionId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorised" }, { status: 401})
    }

    try {
        const { completed } = await request.json()
    
        const task = await prisma.task.findUnique({
            where: {
                id: id,
                userId: session.user.id
            },
            include: {
                nextActions: true
            }
        })

        if (!task) {
            return NextResponse.json({ error: "Task not found "}, { status: 404 })
        }

        // Update the next action
        await prisma.nextAction.update({
            where: {
                id: actionId,
                taskId: id
            },
            data: {
                completed,
                completedAt: completed ? new Date() : null
            }
        })

        // Check if we should auto-complete the task
        if (completed && task.autoComplete && task.status !== "COMPLETED") {
            const updatedActions = task.nextActions.map(action =>
                action.id === actionId ? { ...action, completed: true } : action
            )
            const allCompleted = updatedActions.every(action => action.completed)

            if (allCompleted) {
                await prisma.task.update({
                    where: { id: task.id },
                    data: {
                        status: "COMPLETED",
                        completedAt: new Date()
                    }
                })
            }
        }

        return NextResponse.json({ success: true})
    } catch(error){
        console.error("Error updating next action:", error)
        return NextResponse.json(
            { error: "Failed to update next action" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    try {
        // First verify the user owns this next action through the task
        const nextAction = await prisma.nextAction.findUnique({
            where: { id },
            include: {
                task: {
                    select: { userId: true, id: true }
                }
            }
        })

        if (!nextAction || nextAction.task.userId !== session.user.id) {
            return NextResponse.json({ error: "Next action not found" }, { status: 404 })
        }

        await prisma.nextAction.delete({
            where: { id }
        })

        return NextResponse.json({ message: "Next action deleted successfully" })
    } catch (error) {
        console.error("Error deleting next action:", error)
        return NextResponse.json(
            { error: "Failed to delete next action" },
            { status: 500 }
        )
    }
}
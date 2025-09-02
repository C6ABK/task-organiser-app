import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

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
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorised" }, { status: 401})
    }

    try {
        const { completed } = await request.json()
        
        console.log(`Updating next action ${id} - completed: ${completed}`) // Debug log
    
        // First, find the next action and verify ownership
        const nextAction = await prisma.nextAction.findUnique({
            where: { id },
            include: {
                task: {
                    select: {
                        id: true,
                        userId: true,
                        autoComplete: true,
                        status: true
                    }
                }
            }
        })

        if (!nextAction || nextAction.task.userId !== session.user.id) {
            return NextResponse.json({ error: "Next action not found" }, { status: 404 })
        }

        // Update the next action with full data return
        const updatedNextAction = await prisma.nextAction.update({
            where: { id },
            data: {
                completed,
                completedAt: completed ? new Date() : null
            },
            include: { // Add this to include all fields in response
                task: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        })

        console.log(`Database update result:`, {
    id: updatedNextAction.id,
    completed: updatedNextAction.completed,
    completedAt: updatedNextAction.completedAt,
    timestamp: new Date().toISOString()
})

        // Check if we should auto-complete the task
        if (completed && nextAction.task.autoComplete && nextAction.task.status !== "COMPLETED") {
            const allTaskNextActions = await prisma.nextAction.findMany({
                where: { taskId: nextAction.task.id }
            })
            
            // Check if all next actions are now completed
            const allCompleted = allTaskNextActions.every(action => 
                action.id === id ? completed : action.completed
            )

            if (allCompleted) {
                await prisma.task.update({
                    where: { id: nextAction.task.id },
                    data: {
                        status: "COMPLETED",
                        completedAt: new Date()
                    }
                })
                console.log(`Auto-completed task: ${nextAction.task.id}`) // Debug log
            }
        }

        return NextResponse.json(updatedNextAction) // ✅ Now includes completedAt

        // Remove this unreachable line:
        // return NextResponse.json({ success: true})
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
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../../../auth/[...nextauth]/route"

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string; actionId: string }> }
) {
    const { id, actionId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    try {
        const { completed } = await request.json()

        // Verify task belongs to user and action belongs to task
        const task = await prisma.task.findUnique({
            where: {
                id: id,
                userId: session.user.id
            }
        })

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 })
        }

        const updatedAction = await prisma.nextAction.update({
            where: {
                id: actionId,
                taskId: id
            },
            data: { completed }
        })

        return NextResponse.json({ nextAction: updatedAction })

    } catch (error) {
        console.error("Error updating action:", error)
        return NextResponse.json(
            { error: "Failed to update next action" },
            { status: 500}
        )
    }
}
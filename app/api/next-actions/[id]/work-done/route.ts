import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../../auth/[...nextauth]/route"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    try {
        // Verify the user owns the next action through the task
        const nextAction = await prisma.nextAction.findUnique({
            where: { id },
            include: {
                task: {
                    select: { userId: true }
                }
            }
        })

        if (!nextAction || nextAction.task.userId !== session.user.id) {
            return NextResponse.json({ error: "Next action not found" }, { status: 404 })
        }

        const workDone = await prisma.workDone.findMany({
            where: { nextActionId: id },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ workDone })
    } catch (error) {
        console.error("Error fetching work done:", error)
        return NextResponse.json(
            { error: "Failed to fetch work done" },
            { status: 500 }
        )
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    try {
        const { description, hoursSpent } = await request.json()

        // Verify the user owns the next action through the task
        const nextAction = await prisma.nextAction.findUnique({
            where: { id },
            include: {
                task: {
                    select: { userId: true }
                }
            }
        })

        if (!nextAction || nextAction.task.userId !== session.user.id) {
            return NextResponse.json({ error: "Next action not found" }, { status: 404 })
        }

        const workDone = await prisma.workDone.create({
            data: {
                description,
                hoursSpent,
                nextActionId: id
            }
        })

        return NextResponse.json({ workDone })
    } catch (error) {
        console.error("Error creating work done:", error)
        return NextResponse.json(
            { error: "Failed to create work done" },
            { status: 500 }
        )
    }
}
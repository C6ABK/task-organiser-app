import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch work done details
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const workDone = await prisma.workDone.findFirst({
            where: {
                id: params.id,
                task: {
                    userId: session.user.id,
                },
            },
            include: {
                task: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        })

        if (!workDone) {
            return NextResponse.json({ error: "Work done not found" }, { status: 404 })
        }

        return NextResponse.json(workDone)
    } catch (error) {
        console.error("Error fetching work done:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// PUT - Update work done
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { description } = await request.json()

        if (!description || typeof description !== "string" || !description.trim()) {
            return NextResponse.json({ error: "Description is required" }, { status: 400 })
        }

        // Check if work done exists and belongs to user
        const existingWorkDone = await prisma.workDone.findFirst({
            where: {
                id: params.id,
                task: {
                    userId: session.user.id,
                },
            },
        })

        if (!existingWorkDone) {
            return NextResponse.json({ error: "Work done not found" }, { status: 404 })
        }

        const updatedWorkDone = await prisma.workDone.update({
            where: { id: params.id },
            data: {
                description: description.trim(),
            },
            include: {
                task: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        })

        return NextResponse.json(updatedWorkDone)
    } catch (error) {
        console.error("Error updating work done:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// DELETE - Delete work done
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Check if work done exists and belongs to user
        const existingWorkDone = await prisma.workDone.findFirst({
            where: {
                id: params.id,
                task: {
                    userId: session.user.id,
                },
            },
        })

        if (!existingWorkDone) {
            return NextResponse.json({ error: "Work done not found" }, { status: 404 })
        }

        await prisma.workDone.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: "Work done deleted successfully" })
    } catch (error) {
        console.error("Error deleting work done:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
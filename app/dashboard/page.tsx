"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import CurrentActions from "../components/CurrentActions"
import CreateTask from "../components/CreateTask"

const DashboardPage = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "loading") return
        if (!session) router.push("/signin")
    }, [session, status, router])

    const handleTaskCreated = () => {
        setRefreshTrigger((prev) => prev + 1)
        setIsCreateTaskOpen(false)
    }

    if (status === "loading") {
        return <div>Loading...</div>
    }

    if (!session) {
        return <div>Redirecting...</div>
    }

    return (
        <div className="w-full min-h-screen p-2">
            {/* Mobile */}
            <div className="lg:hidden mb-6">
                <button
                    onClick={() => setIsCreateTaskOpen(!isCreateTaskOpen)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <span>Create New Task</span>
                    <span className="ml-4">
                        {isCreateTaskOpen ? "−" : "+"}
                    </span>
                </button>

                {/* Expand createTask for mobile */}
                <div
                    className={`overflow-hidden transition-all duration-300 ${
                        isCreateTaskOpen ? "max-h-screen mt-4" : "max-h-0"
                    }`}
                >
                    <CreateTask onTaskCreated={handleTaskCreated} />
                </div>
            </div>

            {/* Desktop and Mobile layout */}
            <div className="flex flex-col lg:flex-row lg:space-x-6">
                {/* Large screens: Left side, Mobile: Bottom */}
                <div className="lg:w-2/3 w-full order-2 lg:order-1">
                    <CurrentActions key={refreshTrigger} />
                </div>

                {/* Large screens: Right side, Mobile: Hidden (shown above) */}
                <div className="lg:w-1/3 w-full hidden lg:block order-1 lg:order-2">
                    <CreateTask onTaskCreated={handleTaskCreated} />
                </div>
            </div>
        </div>
    )
}
export default DashboardPage

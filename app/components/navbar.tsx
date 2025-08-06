"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

const Navbar = () => {
    const { data: session, status } = useSession()

    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg">
                Task Organiser
            </Link>
            <div className="flex items-center space-x-4">
                {status === "loading" ? (
                    <span>Loading...</span>
                ) : session ? (
                    // User is signed in
                    <>
                        <span className="text-gray-300">
                            Welcome, {session.user?.name}
                        </span>
                        <button
                            onClick={() => signOut()}
                            className="px-4 py-2 rounded hover:bg-gray-800"
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    // User is not signed in
                    <>
                        <Link href="/signup" className="px-4 py-2 rounded hover:bg-gray-800">
                            Sign Up
                        </Link>
                        <Link href="/signin" className="px-4 py-2 rounded hover:bg-gray-800">
                            Sign In
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar
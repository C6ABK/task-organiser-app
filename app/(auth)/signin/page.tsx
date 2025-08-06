"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

const SignInPage = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()
    const message = searchParams.get("message")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const result = await signIn("credentials", {
            email: form.email,
            password: form.password,
            redirect: false,
        })

        if (result?.error) {
            setError("Invalid credentials")
        } else {
            router.push("/dashboard") // or wherever you want to redirect
        }
        setLoading(false)
    }

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Sign In</h2>
            {message && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                />
                {error && <div className="text-red-500">{error}</div>}
                <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-2 rounded font-semibold"
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>
            </form>
            <div className="mt-4 text-center">
                <Link href="/signup" className="text-gray-600 hover:text-gray-900">
                    Don't have an account? Sign up
                </Link>
            </div>
        </div>
    )
}

export default SignInPage
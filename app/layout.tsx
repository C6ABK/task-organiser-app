import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "./components/navbar"
import { Providers } from "./components/providers"
import Footer from "./components/Footer"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Task Organiser App",
    description: "A web app for organizing tasks efficiently",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
            >
                <Providers>
                    <Navbar />
                    <main className="container mx-auto px-4 py-6">
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    )
}

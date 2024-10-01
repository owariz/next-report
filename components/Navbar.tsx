'use client'

import { useState } from "react"
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

export default function Navbar() {
    const { data: session, status } = useSession()

    return (
        <nav className={`fixed w-full top-0 left-0 z-50 h-[70px] flex justify-center bg-white backdrop-blur-md`}>
            <div className="px-6 2xl:px-0 w-full xl:w-[1480px] h-full flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link href={'/'} className="flex space-x-2 items-center transition duration-500 ease-out hover:scale-110">
                        <h1 className={`font-eng font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-400`}>FullTech</h1>
                    </Link>
                </div>

                <div className="hidden md:flex items-center font-medium space-x-8 text-gray-400">
                    <Link href={'/users'} className="transition-colors duration-500 ease-out hover:text-gray-300">Users</Link>
                    <Link href={'/student'} className="transition-colors duration-500 ease-out hover:text-gray-300">Student</Link>
                    {status === 'unauthenticated' ? (
                        <Link
                            href={'/auth/signin'}
                            className="bg-blue-500 text-white px-8 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Sign In
                        </Link>
                    ) : (
                        <button
                            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                        >
                            Sign Out
                        </button>
                    )}
                </div>

                <div className="block md:hidden relative">
                    {status === 'unauthenticated' ? (
                        <Link
                            href={'/auth/signin'}
                            className="bg-blue-500 text-white px-8 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Sign In
                        </Link>
                    ) : (
                        <button
                            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                        >
                            Sign Out
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}
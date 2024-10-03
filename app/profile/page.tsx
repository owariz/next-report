'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react";
import Link from 'next/link';

interface Profile {
    _id: string
    username: string
    email: string
    role: string
    createdAt: string
    updatedAt: string
}

export default function Profile() {
    const { data: session } = useSession()
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            if (session?.user.id) {
                try {
                    const res = await fetch(`/api/auth/profile/${session.user.id}`)
                    const data = await res.json()
                    setProfile(data.userInfo)
                } catch (error) {
                    console.error("Error fetching profile:", error)
                }
            }
        }

        fetchProfile()
    }, [session?.user.id])

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Add logic for saving updated profile information
    }

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center bg-white border rounded-md shadow-md mx-auto p-2 px-8 mb-4">
                <p className="font-bold">Welcome, {session?.user.name}!</p>
                {/* Button */}
                <Link href={'/profile/'} className="font-bold px-8 py-2 rounded-lg bg-green-100 border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white transition duration-300 ease-out">
                    ประวัติการใช้งาน
                </Link>
            </div>

            <div className="bg-white border rounded-md shadow-md mx-auto p-8 mb-4">
                <h2 className="text-2xl font-semibold mb-4">Profile</h2>
                
                {profile ? (
                    <form onSubmit={handleSave}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                value={profile.username}
                                className="text-gray-400 font-semibold border p-2 rounded-lg border-gray-300 focus:text-gray-800 focus:border-gray-400 w-full outline-none transition duration-300 ease-out"
                                readOnly
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                className="text-gray-400 font-semibold border p-2 rounded-lg border-gray-300 focus:text-gray-800 focus:border-gray-400 w-full outline-none transition duration-300 ease-out"
                                readOnly
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <input
                                type="text"
                                value={profile.role}
                                className="text-gray-400 font-semibold border p-2 rounded-lg border-gray-300 focus:text-gray-800 focus:border-gray-400 w-full outline-none transition duration-300 ease-out"
                                readOnly
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Created At</label>
                            <input
                                type="text"
                                value={new Date(profile.createdAt).toLocaleString()}
                                className="text-gray-400 font-semibold border p-2 rounded-lg border-gray-300 focus:text-gray-800 focus:border-gray-400 w-full outline-none transition duration-300 ease-out"
                                readOnly
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Updated At</label>
                            <input
                                type="text"
                                value={new Date(profile.updatedAt).toLocaleString()}
                                className="text-gray-400 font-semibold border p-2 rounded-lg border-gray-300 focus:text-gray-800 focus:border-gray-400 w-full outline-none transition duration-300 ease-out"
                                readOnly
                            />
                        </div>
                    </form>
                ) : (
                    <p>Loading profile data...</p>
                )}
            </div>
        </div>
    )
}
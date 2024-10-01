'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'

export default function Navbar() {
    const { data: session, status } = useSession()

    return (
        <nav className={`fixed w-full top-0 left-0 z-10 h-[70px] flex justify-center bg-white backdrop-blur-md`}>
            <div className="px-6 2xl:px-0 w-full xl:w-[1480px] h-full flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link href={'/'} className="flex space-x-2 items-center transition duration-500 ease-out hover:scale-110">
                        <h1 className={`font-eng font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-400`}>PMTech</h1>
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
                        <div className="relative">
                            <Menu as="div" className="relative inline-block text-left">
                                <MenuButton className="inline-flex items-center gap-2 rounded-md bg-blue-500 text-white px-8 py-2 text-sm font-semibold shadow-md focus:outline-none hover:bg-blue-600">
                                    {session?.user?.name || "User"} {/* แสดงชื่อผู้ใช้ */}
                                </MenuButton>

                                <Transition
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <MenuItems className="absolute right-0 z-20 mt-2 w-52 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="px-4 py-3 text-gray-800">
                                            Signed in as
                                            <div className="font-medium truncate">{session?.user?.email}</div>
                                        </div>
                                        <div className="py-1">
                                            <MenuItem>
                                                {({ active }) => (
                                                    <Link
                                                        href="/profile"
                                                        className={`${
                                                            active ? 'bg-gray-100' : ''
                                                        } block px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        Profile
                                                    </Link>
                                                )}
                                            </MenuItem>
                                            <MenuItem>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                                                        className={`${
                                                            active ? 'bg-gray-100' : ''
                                                        } block w-full px-4 py-2 text-left text-sm text-gray-700`}
                                                    >
                                                        Sign Out
                                                    </button>
                                                )}
                                            </MenuItem>
                                        </div>
                                    </MenuItems>
                                </Transition>
                            </Menu>
                        </div>
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
                        <div className="relative">
                            <Menu as="div" className="relative inline-block text-left">
                                <MenuButton className="inline-flex items-center gap-2 rounded-md bg-blue-500 text-white px-8 py-2 text-sm font-semibold shadow-md focus:outline-none hover:bg-blue-600">
                                    {session?.user?.name || "User"} {/* แสดงชื่อผู้ใช้ */}
                                </MenuButton>

                                <Transition
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <MenuItems className="absolute right-0 z-20 mt-2 w-52 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="px-4 py-3 text-gray-800">
                                            Signed in as
                                            <div className="font-medium truncate">{session?.user?.email}</div>
                                        </div>
                                        <div className="py-1">
                                            <MenuItem>
                                                {({ active }) => (
                                                    <Link
                                                        href="/profile"
                                                        className={`${
                                                            active ? 'bg-gray-100' : ''
                                                        } block px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        Profile
                                                    </Link>
                                                )}
                                            </MenuItem>
                                            <MenuItem>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                                                        className={`${
                                                            active ? 'bg-gray-100' : ''
                                                        } block w-full px-4 py-2 text-left text-sm text-gray-700`}
                                                    >
                                                        Sign Out
                                                    </button>
                                                )}
                                            </MenuItem>
                                        </div>
                                    </MenuItems>
                                </Transition>
                            </Menu>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

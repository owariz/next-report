'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface Misconduct {
    date: string
    misconduct: string
    scoreDeduction: number
    remark: string
}

interface Student {
    std_id: string
    name: string
    surname: string
    grade: string
    classroom: string
    score?: number
    misconducts?: Misconduct[]
}

export default function AddStdent() {
    const [newStudent, setNewStudent] = useState<Student>({
        std_id: '',
        name: '',
        surname: '',
        grade: '',
        classroom: '',
        score: 100,
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch('/api/student/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStudent)
            })

            if (res.status === 201) {
                toast.success('เพิ่มข้อมูลนักศึกษาเรียบร้อยแล้ว')
                setNewStudent({
                    std_id: '',
                    name: '',
                    surname: '',
                    grade: '',
                    classroom: '',
                    score: 100
                })
            } else {
                toast.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลนักศึกษา')
            }
        } catch (err) {
            console.error('Error:', err)
            toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์')
        } finally {
            setIsLoading(false)
        }
    }

    const handleNewStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewStudent((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const isFormValid = newStudent.std_id.trim() && newStudent.name.trim() && newStudent.surname.trim()

    return (
        <div className="container mx-auto">
            <div className="flex justify-end bg-white border rounded-md shadow-md mx-auto p-2 mb-4">
                {/* Button */}
                <Link href={'/student'} className="font-bold px-8 py-2 rounded-lg bg-red-100 border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition duration-300 ease-out">
                    ยกเลิก
                </Link>
            </div>

            <div className="bg-white border rounded-md shadow-md mx-auto p-8 mb-4">
                <h2 className="text-2xl font-semibold mb-4 text-center">เพิ่มนักศึกษาใหม่</h2>

                <form onSubmit={handleAddStudent}>
                    <div className="mb-4">
                        <label htmlFor="std_id" className="block text-sm font-medium text-gray-700 mb-1">
                            รหัสนักศึกษา
                        </label>
                        <input
                            type="text"
                            id="std_id"
                            name="std_id"
                            value={newStudent.std_id}
                            onChange={handleNewStudentChange}
                            className="font-semibold border p-2 rounded-lg w-full outline-none border-gray-300 focus:border-gray-400"
                            placeholder="กรอกรหัสนักศึกษา"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            ชื่อ
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={newStudent.name}
                            onChange={handleNewStudentChange}
                            className="font-semibold border p-2 rounded-lg w-full outline-none border-gray-300 focus:border-gray-400"
                            placeholder="กรอกชื่อ"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
                            นามสกุล
                        </label>
                        <input
                            type="text"
                            id="surname"
                            name="surname"
                            value={newStudent.surname}
                            onChange={handleNewStudentChange}
                            className="font-semibold border p-2 rounded-lg w-full outline-none border-gray-300 focus:border-gray-400"
                            placeholder="กรอกนามสกุล"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                            ชั้นเรียน
                        </label>
                        <input
                            type="text"
                            id="grade"
                            name="grade"
                            value={newStudent.grade}
                            onChange={handleNewStudentChange}
                            className="font-semibold border p-2 rounded-lg w-full outline-none border-gray-300 focus:border-gray-400"
                            placeholder="กรอกชั้นเรียน"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="classroom" className="block text-sm font-medium text-gray-700 mb-1">
                            ห้องเรียน
                        </label>
                        <input
                            type="text"
                            id="classroom"
                            name="classroom"
                            value={newStudent.classroom}
                            onChange={handleNewStudentChange}
                            className="font-semibold border p-2 rounded-lg w-full outline-none border-gray-300 focus:border-gray-400"
                            placeholder="กรอกห้องเรียน"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={!isFormValid || isLoading}
                        className={`font-bold w-full py-2 rounded-lg transition duration-300 ease-out mb-3 ${
                            !isFormValid || isLoading
                                ? 'bg-gray-100 border-2 border-gray-400 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-100 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white'
                        }`}
                    >
                        {isLoading ? 'กำลังเพิ่มข้อมูล...' : 'เพิ่มนักศึกษา'}
                    </button>
                </form>
            </div>
        </div>
    )
}
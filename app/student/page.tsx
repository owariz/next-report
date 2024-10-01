'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Misconduct {
  date: string;
  misconduct: string;
  scoreDeduction: number;
  remark: string;
}

interface Student {
  std_id: string;
  name: string;
  surname: string;
  grade: string;
  classroom: string;
  score?: number;
  misconducts?: Misconduct[];
}

export default function Student() {
  const router = useRouter()
  const [sid, setSid] = useState('')
  const [student, setStudent] = useState<Student | null>(null)
  const [misconductHistory, setMisconductHistory] = useState<Misconduct[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false) // State สำหรับเพิ่มข้อมูล
  const [newStudent, setNewStudent] = useState<Student>({
    std_id: '',
    name: '',
    surname: '',
    grade: '',
    classroom: '',
    score: 100,
  }) // สำหรับเก็บข้อมูลนักศึกษาใหม่

  const fetchStudentDetails = async (sid: number) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/report/search/${sid}`)
      if (res.status === 200) {
        const data = await res.json()
        setStudent(data.student)
        setMisconductHistory(data.student.misconducts || [])
        setError('')
      } else {
        toast.error('ไม่พบข้อมูลนักศึกษา')
        setError('ไม่พบข้อมูลนักศึกษา')
        setStudent(null)
      }
    } catch (err) {
      toast.error('เกิดข้อผิดพลาดในการค้นหาข้อมูล')
      setError('เกิดข้อผิดพลาดในการค้นหาข้อมูล')
      setStudent(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!sid.trim()) {
      setError('Please enter a student ID')
      return
    }
    fetchStudentDetails(Number(sid))
  }

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/report/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      })

      if (res.status === 201) {
        toast.success('เพิ่มข้อมูลนักศึกษาเรียบร้อยแล้ว')
        setStudent(null)
        setSid('')
        setIsAdding(false) // กลับไปหน้าค้นหานักศึกษา
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
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์')
    }
  }

  const handleNewStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewStudent((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  if (isAdding) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-white p-8 rounded-md shadow-md max-w-md mx-auto mb-4">
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
              className="w-full font-bold px-4 py-2 rounded-lg bg-green-100 border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
            >
              เพิ่มนักศึกษา
            </button>
          </form>

          <button
            onClick={() => setIsAdding(false)}
            className="font-bold bg-gray-100 border-2 border-gray-400 text-gray-400 px-6 py-2 mt-6 rounded-lg transition duration-300 ease-out hover:bg-gray-400 hover:text-white"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white p-2 rounded-md shadow-md max-w-md mx-auto mb-4">
        {/* Add New Student Button */}
        <button
          onClick={() => setIsAdding(true)}
          className="w-full font-bold px-4 py-2 rounded-lg bg-blue-100 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition duration-300 ease-out"
        >
          เพิ่มนักศึกษาใหม่
        </button>
      </div>

      {/* Existing Search Form */}
      <div className="bg-white p-8 rounded-md shadow-md max-w-md mx-auto mb-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">ค้นหานักศึกษา</h2>
        <form onSubmit={handleSearch}>
          <div className="mb-4">
            <label htmlFor="sid" className="block text-sm font-medium text-gray-700 mb-1">
              รหัสนักศึกษา
            </label>
            <input
              type="number"
              id="sid"
              value={sid}
              onChange={(e) => {
                setSid(e.target.value)
                if (error) setError('')
              }}
              className={`font-semibold border p-2 rounded-lg w-full outline-none transition duration-300 ease-out ${
                error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-400'
              }`}
              placeholder="กรอกรหัสนักศึกษา"
            />
            {error && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>{error}</span>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full font-bold px-4 py-2 rounded-lg bg-green-100 border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white transition duration-300 ease-out"
          >
            {isLoading ? 'กำลังค้นหา...' : 'ค้นหา'}
          </button>
        </form>
      </div>
    </div>
  )
}
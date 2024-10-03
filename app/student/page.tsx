'use client'

import React from 'react'
import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
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
  prefix: string
  nickname: string;
  name: string;
  surname: string
  grade: string
  classroom: string
  score?: number
  misconducts?: Misconduct[]
}

export default function Student() {
  const [sid, setSid] = useState('')
  const [student, setStudent] = useState<Student | null>(null)
  const [misconductHistory, setMisconductHistory] = useState<Misconduct[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchStudentDetails = async (sid: number) => {
    setIsLoading(true)
    setIsSubmitting(true)

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
      console.error('Error:', err)
      toast.error('เกิดข้อผิดพลาดในการค้นหาข้อมูล')
      setError('เกิดข้อผิดพลาดในการค้นหาข้อมูล')
      setStudent(null)
    } finally {
      setIsLoading(false)
      setIsSubmitting(false)
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

  return (
    <div className="container mx-auto">
      <div className="flex justify-end bg-white border rounded-md shadow-md mx-auto p-2 mb-4">
        {/* Button */}
        {student ? (
          <Link href={`/student/edit/${sid}`} className="font-bold px-8 py-2 rounded-lg bg-orange-100 border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white transition duration-300 ease-out">
            แก้ไขข้อมูลนักศึกษา
          </Link>
        ) : (
          <Link href={'/student/add'} className="font-bold px-8 py-2 rounded-lg bg-blue-100 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition duration-300 ease-out">
            เพิ่มนักศึกษาใหม่
          </Link>
        )}
      </div>

      {/* Existing Search Form */}
      <div className="bg-white border rounded-md shadow-md mx-auto p-8 mb-4">
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
              disabled={!sid.trim() || isSubmitting}
              className={`font-bold w-full py-2 rounded-lg transition duration-300 ease-out ${
                !sid.trim() || isSubmitting
                  ? 'bg-gray-100 border-2 border-gray-400 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white'
              }`}
            >
              {isLoading ? 'กำลังค้นหา...' : 'ค้นหา'}
            </button>
        </form>
        
        <hr className="border-gray-200 my-2" />
        {/* Student Details */}
        {(student) ? (
          <>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-b pb-2">Student Details</h2>
            <div className="relative overflow-x-auto mb-4">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">SID</th>
                    <th scope="col" className="px-6 py-3">Nickname</th>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Classroom</th>
                    <th scope="col" className="px-6 py-3">Total Score</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className={`border-t bg-gray-100`}>
                    <td className="px-6 py-4 whitespace-nowrap">{student.std_id}</td>
                    <td className="px-6 py-4">{student.nickname}</td>
                    <td className="px-6 py-4">{student.prefix}{student.name} {student.surname}</td>
                    <td className="px-6 py-4">{student.grade}/{student.classroom}</td>
                    <td className="px-6 py-4">{student.score} points</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold my-4">Misconduct History</h3>
            {misconductHistory.length > 0 ? (
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Misconduct</th>
                        <th scope="col" className="px-6 py-3">Deduction</th>
                        <th scope="col" className="px-6 py-3">Remarks</th>
                    </tr>
                  </thead>

                  <tbody>
                    {misconductHistory.map((record, index) => {
                      return (
                        <tr key={index} className={`border-t ${index % 2 === 0? 'bg-gray-100' : 'bg-gray-50'}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(record.date).toLocaleString('th-TH', {
                              year: 'numeric',
                              month: 'numeric',
                              day: '2-digit',
                              hour: 'numeric',
                              minute: 'numeric',
                              second: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4">{record.misconduct}</td>
                          <td className="px-6 py-4">{record.scoreDeduction} points</td>
                          <td className="px-6 py-4">{record.remark == '' ? "ไม่ระบุ" : record.remark}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No misconducts recorded</p>
            )}
          </>
        ) : (
            null
        )}
      </div>
    </div>
  )
}
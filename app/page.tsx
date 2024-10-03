'use client'

import React from 'react'
import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Student {
  std_id: string
  prefix: string
  name: string
  surname: string
  grade: string
  classroom: string
  score?: number
}

export default function Dashboard() {
  const [sid, setSid] = useState('')
  const [student, setStudent] = useState<Student | null>(null)
  const [error, setError] = useState('')
  const [reportVisible, setReportVisible] = useState(false)
  const [misconduct, setMisconduct] = useState('')
  const [scoreDeduction, setScoreDeduction] = useState(0)
  const [remark, setRemark] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReporting, setIsReporting] = useState(false)

  const generalMisconducts = [
    { label: "Late submission", score: 10 },
    { label: "Cheating", score: 20 },
    { label: "Disrespecting teacher", score: 15 }
  ]

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sid.trim()) {
      toast.error('กรุณากรอกรหัสนักศึกษา')
      setError('กรุณากรอกรหัสนักศึกษา')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/report/search/${sid}`)
      if (res.status === 200) {
        const data = await res.json()
        setStudent(data.student)
        setError('')
      } else {
        toast.error('ไม่พบข้อมูลนักศึกษา')
        setError('ไม่พบข้อมูลนักศึกษา')
        setStudent(null)
      }
    } catch (err) {
      console.error('Error fetching student data:', err)
      toast.error('เกิดข้อผิดพลาดในการค้นหาข้อมูล')
      setError('เกิดข้อผิดพลาดในการค้นหาข้อมูล')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!misconduct.trim()) {
      toast.error('กรุณาเลือกหรือระบุการกระทำความผิด')
      return
    }
    if (scoreDeduction <= 0) {
      toast.error('กรุณาระบุคะแนนที่จะหัก')
      return
    }

    setIsReporting(true)
    try {
      const res = await fetch(`/api/report/misconduct/${sid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ misconduct, scoreDeduction, remark })
      })

      if (res.status === 200) {
        const data = await res.json()
        setStudent(data.student)
        setSuccess(true)
        setReportVisible(false)
        toast.success('บันทึกการกระทำความผิดสำเร็จ')
      } else {
        toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
      }
    } catch (err) {
      console.error('Error save student data:', err)
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setIsReporting(false)
    }
  }

  const handleReset = () => {
    setSuccess(false)
    setStudent(null)
    setSid('')
    setMisconduct('')
    setScoreDeduction(0)
    setRemark('')
    setError('')
  }

  return (
    <div className="container mx-auto">
      <div className="bg-white border rounded-md shadow-md mx-auto p-8 mb-4">
        <h2 className="text-center text-2xl font-semibold mb-4">ระบบบันทึกคะแนนนักศึกษา</h2>

        <form onSubmit={handleSearch} className="flex flex-col items-center">
            <div className="w-full mb-4">
              <label htmlFor="sid" className="block text-sm font-medium text-gray-700 mb-1">
                รหัสนักศึกษา
              </label>
              <input
                type="number"
                id="sid"
                placeholder="กรอกรหัสนักศึกษา"
                value={sid}
                onChange={(e) => {
                  setSid(e.target.value)
                  if (error) setError('')
                }}
                className={`font-semibold border p-2 rounded-lg w-full outline-none transition duration-300 ease-out ${
                  error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-400'
                }`}
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
              {isSubmitting ? 'กำลังค้นหา...' : 'ค้นหา'}
            </button>
          </form>
          <hr className="border-gray-200 my-2" />

        {!student ? (
          null
        ) : success ? (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">บันทึกการกระทำความผิดสำเร็จ</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p><strong>ชื่อ-นามสกุล:</strong> {student.name} {student.surname}</p>
              <p><strong>คะแนนที่หัก:</strong> {scoreDeduction} คะแนน</p>
              <p><strong>คะแนนคงเหลือ:</strong> {student.score} คะแนน</p>
            </div>

            <button
              onClick={handleReset}
              className="font-bold bg-green-100 border-2 border-green-400 text-green-400 px-4 py-2 rounded-lg hover:bg-green-400 hover:text-white transition duration-300 ease-out"
            >
              ค้นหาใหม่
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-b pb-2">Student Details</h2>
            <div className="relative overflow-x-auto mb-4">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">SID</th>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Classroom</th>
                    <th scope="col" className="px-6 py-3">Total Score</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className={`border-t bg-gray-100`}>
                    <td className="px-6 py-4 whitespace-nowrap">{student.std_id}</td>
                    <td className="px-6 py-4">{student.prefix}{student.name} {student.surname}</td>
                    <td className="px-6 py-4">{student.grade}/{student.classroom}</td>
                    <td className="px-6 py-4">{student.score} points</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {!reportVisible ? (
              <div className="text-center">
                <button
                  onClick={() => setReportVisible(true)}
                  className="font-bold bg-red-100 border-2 border-red-400 text-red-400 px-4 py-2 rounded-lg hover:bg-red-400 hover:text-white transition duration-300 ease-out"
                >
                  บันทึกการกระทำความผิด
                </button>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="mt-4 p-4 border rounded-lg bg-gray-50">
                <h4 className="text-lg font-semibold mb-4">บันทึกการกระทำความผิด</h4>

                <div className="mb-4">
                  <label htmlFor="misconduct-select" className="block text-sm font-medium text-gray-700 mb-1">
                    เลือกการกระทำความผิด
                  </label>
                  <select
                    id="misconduct-select"
                    value={misconduct}
                    onChange={(e) => {
                      const selectedMisconduct = generalMisconducts.find(m => m.label === e.target.value)
                      setMisconduct(selectedMisconduct ? selectedMisconduct.label : '')
                      setScoreDeduction(selectedMisconduct ? selectedMisconduct.score : 0)
                    }}
                    className="border border-gray-300 p-2 rounded-lg w-full"
                  >
                    <option value="">เลือกการกระทำความผิด</option>
                    {generalMisconducts.map((m, index) => (
                      <option key={index} value={m.label}>
                        {m.label} - หัก {m.score} คะแนน
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="custom-misconduct" className="block text-sm font-medium text-gray-700 mb-1">
                    ระบุการกระทำความผิดเอง
                  </label>
                  <input
                    type="text"
                    id="custom-misconduct"
                    placeholder="ระบุการกระทำความผิด"
                    value={misconduct}
                    onChange={(e) => setMisconduct(e.target.value)}
                    className="font-semibold border p-2 rounded-lg w-full outline-none transition duration-300 ease-out border-gray-300 focus:border-gray-400"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="score-deduction" className="block text-sm font-medium text-gray-700 mb-1">
                    คะแนนที่จะหัก
                  </label>
                  <input
                    type="number"
                    id="score-deduction"
                    placeholder="ระบุคะแนนที่จะหัก"
                    value={scoreDeduction}
                    onChange={(e) => setScoreDeduction(Number(e.target.value))}
                    className="font-semibold border p-2 rounded-lg w-full outline-none transition duration-300 ease-out border-gray-300 focus:border-gray-400"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-1">
                    หมายเหตุ
                  </label>
                  <textarea
                    id="remark"
                    placeholder="ระบุหมายเหตุ (ถ้ามี)"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    className="border p-2 rounded-lg w-full h-24 resize-none outline-none transition duration-300 ease-out border-gray-300 focus:border-gray-400"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={isReporting || !misconduct.trim() || scoreDeduction <= 0}
                    className={`flex-1 font-bold py-2 rounded-lg transition duration-300 ease-out ${
                      isReporting || !misconduct.trim() || scoreDeduction <= 0
                        ? 'bg-gray-100 border-2 border-gray-400 text-gray-400 cursor-not-allowed'
                        : 'bg-green-100 border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white'
                    }`}
                  >
                    {isReporting ? 'กำลังบันทึก...' : 'บันทึก'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportVisible(false)}
                    className="flex-1 font-bold bg-gray-100 border-2 border-gray-400 text-gray-400 py-2 rounded-lg hover:bg-gray-400 hover:text-white transition duration-300 ease-out"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
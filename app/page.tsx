'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { AlertCircle } from 'lucide-react'

interface Student {
  std_id: string;
  name: string;
  surname: string;
  grade: string;
  classroom: string;
  score?: number;
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
    <div className="container mx-auto p-8 flex justify-center">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold mb-4">ระบบบันทึกคะแนนนักศึกษา</h2>

        {!student ? (
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
          <div className="text-center">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-2">ข้อมูลนักศึกษา</h3>
              <p><strong>รหัส:</strong> {student.std_id}</p>
              <p><strong>ชื่อ-นามสกุล:</strong> {student.name} {student.surname}</p>
              <p><strong>ชั้นเรียน:</strong> {student.grade}/{student.classroom}</p>
            </div>

            {!reportVisible ? (
              <button
                onClick={() => setReportVisible(true)}
                className="font-bold bg-red-100 border-2 border-red-400 text-red-400 px-4 py-2 rounded-lg hover:bg-red-400 hover:text-white transition duration-300 ease-out"
              >
                บันทึกการกระทำความผิด
              </button>
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
                    className="border border-gray-300 p-2 rounded-lg w-full"
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
                    className="border border-gray-300 p-2 rounded-lg w-full"
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
                    className="border border-gray-300 p-2 rounded-lg w-full h-24 resize-none"
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
          </div>
        )}
      </div>
    </div>
  )
}
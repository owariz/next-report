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
  score?: number; // เพิ่ม ? เพื่อระบุว่าเป็น optional property
}

export default function Dashboard() {
  const [ip, setIP] = useState('Loading...')
  const [sid, setSid] = useState('')
  const [student, setStudent] = useState<Student | null>(null)
  const [error, setError] = useState('')
  const [reportVisible, setReportVisible] = useState(false)
  const [misconduct, setMisconduct] = useState('')
  const [scoreDeduction, setScoreDeduction] = useState(0)
  const [remark, setRemark] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const generalMisconducts = [
    { label: "Late submission", score: 10 },
    { label: "Cheating", score: 20 },
    { label: "Disrespecting teacher", score: 15 }
  ]

  // Fetch user IP
  useEffect(() => {
    const fetchIP = async () => {
      const res = await fetch('https://api64.ipify.org?format=json')
      const data = await res.json()
      setIP(data.ip)
    }
    fetchIP()
  }, [])

  // Handle search
  const handleSearch = async () => {

    if (!sid.trim()) {
      toast.error('Please enter a student ID');
      setError('Student ID is required');
      return;

    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/report/search/${sid}`)
      if (res.status === 200) {
        const data = await res.json()
        setStudent(data.student)
        setError('')
      } else {
        toast.error('Student not found.');
        setError('Student not found')
        setStudent(null)
      }
    } catch (err) {
      toast.error('An error occurred while fetching student data');
      setError('An error occurred while fetching student data')
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle report submission
  const handleReportSubmit = async () => {
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
      } else {
        toast.error('An error occurred while reporting misconduct');
        setError('An error occurred while reporting misconduct')
      }
    } catch (err) {
      toast.error('An error occurred while reporting misconduct');
      setError('An error occurred while reporting misconduct')
    }
  }

  // Reset form and go back to search page
  const handleReset = () => {
    setSuccess(false)
    setStudent(null)
    setSid('')
  }

  return (
    <div className="container mx-auto flex justify-center">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold mb-4">ระบบบันทึกคะแนนนักศึกษา</h2>
        <div className="text-center text-gray-400 font-medium">
          <p>Your IP: {ip}</p>
        </div>

        <hr className="border-gray-200 mb-6" />

        {!student ? (
          <div className="flex flex-col items-center">
            <input
              type="number"
              placeholder="Enter student ID"
              value={sid}
              onChange={(e) => {
                setSid(e.target.value);
                if (error) setError('');
              }}
              className={`font-semibold border p-2 rounded-lg w-full outline-none mb-1 transition duration-300 ease-out ${
                error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-400'
              }`}
            />

            {error && (
              <div className="flex items-center text-red-500 text-sm mb-4">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleSearch}
              disabled={!sid.trim() || isSubmitting}
              className={`font-bold px-20 py-2 rounded-lg transition duration-300 ease-out ${
                !sid.trim() || isSubmitting
                  ? 'bg-gray-100 border-2 border-gray-400 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white'
              }`}
            >
              {isSubmitting ? 'Searching...' : 'Search Student'}
            </button>
          </div>
        ) : success ? (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Misconduct Reported</h3>
            <p><strong>Student Name:</strong> {student.name} {student.surname}</p>
            <p><strong>Score Deducted:</strong> {scoreDeduction} points</p>
            <p><strong>Total Score:</strong> {student.score} points</p>

            {/* Button to go back */}
            <button
              onClick={handleReset}
              className="bg-green-500 text-white px-4 py-2 mt-4 rounded hover:bg-green-600"
            >
              Back to Search
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-lg font-semibold">Student Found</h3>
            <p><strong>ID:</strong> {student.std_id}</p>
            <p><strong>Name:</strong> {student.name} {student.surname}</p>
            <p><strong>Classroom:</strong> {student.grade}/{student.classroom}</p>

            {/* Report Misconduct Button */}
            <button
              onClick={() => setReportVisible(!reportVisible)}
              className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600"
            >
              Report Misconduct
            </button>

            {reportVisible && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-100">
                <h4 className="text-lg font-semibold mb-2">Report Misconduct</h4>

                {/* Dropdown for general misconduct */}
                <select
                  value={misconduct}
                  onChange={(e) => {
                    const selectedMisconduct = generalMisconducts.find(m => m.label === e.target.value)
                    setMisconduct(selectedMisconduct ? selectedMisconduct.label : '')
                    setScoreDeduction(selectedMisconduct ? selectedMisconduct.score : 0)
                  }}
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                >
                  <option value="">Select General Misconduct</option>
                  {generalMisconducts.map((misconduct, index) => (
                    <option key={index} value={misconduct.label}>{misconduct.label} - Deduct {misconduct.score} points</option>
                  ))}
                </select>

                {/* Custom Misconduct and Score Deduction */}
                <input
                  type="text"
                  placeholder="Custom Misconduct"
                  value={misconduct}
                  onChange={(e) => setMisconduct(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                />
                <input
                  type="number"
                  placeholder="Score Deduction"
                  value={scoreDeduction}
                  onChange={(e) => setScoreDeduction(Number(e.target.value))}
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                />

                {/* Remark */}
                <textarea
                  placeholder="Remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                ></textarea>

                <button
                  onClick={handleReportSubmit}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Submit Report
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
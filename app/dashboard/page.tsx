'use client'

import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [ip, setIP] = useState('')
  const [sid, setSid] = useState('')
  const [student, setStudent] = useState(null)
  const [error, setError] = useState('')
  const [reportVisible, setReportVisible] = useState(false)
  const [misconduct, setMisconduct] = useState('')
  const [scoreDeduction, setScoreDeduction] = useState(0)
  const [remark, setRemark] = useState('')
  const [success, setSuccess] = useState(false)

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
    try {
      const res = await fetch(`/api/report/search/${sid}`)
      if (res.status === 200) {
        const data = await res.json()
        setStudent(data.student)
        setError('')
      } else {
        setError('Student not found')
        setStudent(null)
      }
    } catch (err) {
      setError('An error occurred while fetching student data')
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
        setError('An error occurred while reporting misconduct')
      }
    } catch (err) {
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
    <div className="container mx-auto flex justify-center ">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold mb-4">User Dashboard</h2>
        <div className="text-center mb-4">
          <p>Your IP: {ip}</p>
        </div>

        {!student ? (
          <div className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Enter student ID"
              value={sid}
              onChange={(e) => setSid(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Search Student
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
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
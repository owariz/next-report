'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Student() {
  const router = useRouter()
  const [sid, setSid] = useState('')
  const [student, setStudent] = useState(null)
  const [misconductHistory, setMisconductHistory] = useState([])
  const [error, setError] = useState('')

    const fetchStudentDetails = async (sid) => {
        try {
            const res = await fetch(`/api/report/search/${sid}`);
            if (res.status === 200) {
                const data = await res.json();
                setStudent(data.student);
                setMisconductHistory(data.student.misconducts || []); // ตรวจสอบว่า misconducts มีอยู่
                setError('');
            } else {
                setError('Student not found');
            }
        } catch (err) {
            setError('An error occurred while fetching student details');
        }
    };

  const handleSearch = (e) => {
    e.preventDefault()
    if (sid) {
      fetchStudentDetails(sid)
    } else {
      setError('Please enter a valid student ID')
    }
  }

  if (!student) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Search for a Student</h2>
          <form onSubmit={handleSearch}>
            <div className="mb-4">
              <label htmlFor="sid" className="block text-lg font-semibold mb-2">
                Enter Student ID:
              </label>
              <input
                type="text"
                id="sid"
                value={sid}
                onChange={(e) => setSid(e.target.value)}
                className="border rounded w-full px-4 py-2"
                placeholder="Enter student ID"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Student Details</h2>
        <div className="mb-4">
          <p><strong>ID:</strong> {student.std_id}</p>
          <p><strong>Name:</strong> {student.name} {student.surname}</p>
          <p><strong>Classroom:</strong> {student.grade}/{student.classroom}</p>
          <p><strong>Total Score:</strong> {student.score} points</p>
        </div>

        <h3 className="text-xl font-semibold mb-4">Misconduct History</h3>
        {(student.misconducts && student.misconducts.length > 0) ? (
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Misconduct</th>
                        <th className="px-4 py-2">Deduction</th>
                        <th className="px-4 py-2">Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {student.misconducts.map((record, index) => (
                        <tr key={index} className="border-t">
                            <td className="px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                            <td className="px-4 py-2">{record.misconduct}</td>
                            <td className="px-4 py-2">-{record.scoreDeduction} points</td>
                            <td className="px-4 py-2">{record.remark}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p>No misconducts recorded</p>
        )}

        <button
          onClick={() => setStudent(null)} // Clear student data to show the search form again
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
        >
          Search Again
        </button>
      </div>
    </div>
  )
}

'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SignUp() {
    const router = useRouter()
    const { status } = useSession()
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      name: ''
    })
    const [error, setError] = useState('')

    useEffect(() => {
      if (status === 'authenticated') {
        router.replace('/')
      }
    }, [status, router])
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        
        const data = await res.json()
        
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong')
        }
        
        router.push('/auth/signin')
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred')
      }
    }

    if (status === 'loading') {
      return <div className="flex justify-center items-center h-screen">Loading...</div>
    }
  
    if (status === 'authenticated') {
      return null
    }
  
    return (
      <div className="container mx-auto">
        <div className="bg-white border rounded-md shadow-md mx-auto p-8 mb-4">
          <h2 className="text-center text-2xl font-semibold mb-4">Create your account</h2>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 text-center">{error}</div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Name"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>
  
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
  )
}

import React from 'react'

export default function Footer() {
  return (
    <>
        <div className="text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} PMTech. All rights reserved. • Made with 😁👍 by <a className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500 font-semibold" href="https://fulltech.vercel.app/">FullTech</a></p>
        </div>
    </>
  )
}

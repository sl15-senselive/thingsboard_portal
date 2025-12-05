import Sidebar from '@/components/AdminNavbar'
import React from 'react'

const page = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6"></div>
    </div>
  )
}

export default page
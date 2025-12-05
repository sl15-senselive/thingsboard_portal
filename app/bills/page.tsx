import { Sidebar } from '@/components/Sidebar'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
          <div>
            <Sidebar />
          </div>
          <div className="w-full p-8 "></div>
    </div>
  )
}

export default page
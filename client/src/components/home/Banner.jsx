import React from 'react'
import { Sparkles } from 'lucide-react'

const Banner = () => {
  return (
    <div>
        <div className="w-full py-2.5 text-sm text-green-700 text-center bg-gradient-to-r from-green-50 to-white border-b border-green-100">
            <p className="flex items-center justify-center gap-2">
                <Sparkles className="size-3.5 text-green-500" />
                <span className="px-2.5 py-0.5 rounded-md text-white bg-green-600 text-xs font-medium">New</span>
                AI-powered resume writing feature is now available
            </p>
        </div>
    </div>
  )
}

export default Banner
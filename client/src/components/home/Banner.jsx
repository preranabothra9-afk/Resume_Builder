import React from 'react'
import { Sparkles } from 'lucide-react'

const Banner = () => {
  return (
    <div className="w-full py-2.5 text-sm text-center bg-linear-to-r from-violet-900/80 via-fuchsia-900/60 to-cyan-900/80 border-b border-theme relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent" />
      <p className="relative flex items-center justify-center gap-2 text-white/80">
        <Sparkles className="size-3.5 text-cyan-400" />
        <span className="px-2.5 py-0.5 rounded-md text-white bg-linear-to-r from-violet-600 to-fuchsia-600 text-xs font-medium">New</span>
        AI-powered resume writing feature is now available
      </p>
    </div>
  )
}

export default Banner

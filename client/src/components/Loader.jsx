import React from 'react'

const Loader = () => {
  return (
    <div className='app-bg flex items-center justify-center min-h-screen'>
      <div className='flex flex-col items-center gap-4'>
        <div className='relative'>
          <div className='size-12 border-[3px] border-white/10 border-t-violet-500 rounded-full animate-spin' />
          <div className='absolute inset-0 size-12 border-[3px] border-transparent border-r-cyan-500 rounded-full animate-spin animate-pulse' style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        </div>
        <div className='flex items-center gap-2'>
          <div className='size-1.5 rounded-full bg-violet-500 animate-bounce' style={{ animationDelay: '0ms' }} />
          <div className='size-1.5 rounded-full bg-fuchsia-500 animate-bounce' style={{ animationDelay: '150ms' }} />
          <div className='size-1.5 rounded-full bg-cyan-500 animate-bounce' style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default Loader

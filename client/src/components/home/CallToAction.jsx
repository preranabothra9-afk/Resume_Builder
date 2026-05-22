import React from 'react'
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from 'lucide-react';

const CallToAction = () => {
  return (
    <div id='cta' className='relative bg-[#08080f] px-6 pb-28'>
      <div className="relative max-w-5xl mx-auto overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-600 p-1">
        <div className="relative overflow-hidden rounded-3xl bg-[#08080f] px-8 py-16 sm:px-16 text-center">
          <div className="absolute top-0 right-0 -z-0 size-64 bg-violet-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 -z-0 size-48 bg-cyan-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex flex-col items-center gap-8">
            <div className="inline-flex size-12 rounded-xl gradient-btn items-center justify-center">
              <Sparkles className="size-6 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white max-w-xl leading-tight">Build a professional resume that helps you stand out and get hired.</h2>
            <Link to="/app?state=register"
              className="flex items-center gap-2 rounded-xl py-3.5 px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 transition-all font-medium shadow-2xl shadow-violet-500/30 glow text-lg">
              <span>Get Started Free</span>
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallToAction

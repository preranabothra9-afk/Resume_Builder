import React from 'react'
import { Link } from "react-router-dom";
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <div id='cta' className='w-full max-w-5xl mx-auto px-6 mt-24'>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-700 px-8 py-16 sm:px-16 text-center">
            <div className="absolute top-0 right-0 -z-0 size-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 -z-0 size-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-8">
                <h2 className="text-2xl sm:text-3xl font-semibold text-white max-w-lg leading-tight">Build a professional resume that helps you stand out and get hired.</h2>
                <Link to="/app?state=register" className="flex items-center gap-2 rounded-lg py-3.5 px-8 bg-white text-green-600 hover:bg-gray-50 transition-all font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    <span>Get Started Free</span>
                    <ArrowRight className="size-4" />
                </Link>
            </div>
        </div>
    </div>
  )
}

export default CallToAction
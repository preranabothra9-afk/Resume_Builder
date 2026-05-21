import React from 'react'
import { Linkedin, Twitter, Youtube } from 'lucide-react'

const Footer = () => {
  return (
    <>
        <footer className="overflow-hidden py-16 px-6 md:px-16 lg:px-24 xl:px-32 text-sm text-gray-500 bg-gray-50 border-t border-gray-100 mt-24">
            <div className="max-w-7xl mx-auto flex flex-wrap gap-12 lg:gap-20">
                <div className="flex flex-wrap flex-1 gap-10 md:gap-16">
                    <div className="min-w-48">
                        <a href="#">
                            <img src="/logo.svg" alt="logo" className='h-10 w-auto' />
                        </a>
                        <p className="mt-4 max-w-52 text-gray-500 leading-relaxed">Making every job seeker feel confident with professional resume tools.</p>
                    </div>
                    <div>
                        <p className="text-slate-800 font-semibold">Product</p>
                        <ul className="mt-4 space-y-3">
                            <li><a href="/" className="hover:text-green-600 transition-colors">Home</a></li>
                            <li><a href="/" className="hover:text-green-600 transition-colors">Features</a></li>
                            <li><a href="/" className="hover:text-green-600 transition-colors">Templates</a></li>
                            <li><a href="/" className="hover:text-green-600 transition-colors">Pricing</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-slate-800 font-semibold">Resources</p>
                        <ul className="mt-4 space-y-3">
                            <li><a href="/" className="hover:text-green-600 transition-colors">Blog</a></li>
                            <li><a href="/" className="hover:text-green-600 transition-colors">Resume Tips</a></li>
                            <li><a href="/" className="hover:text-green-600 transition-colors">Support</a></li>
                            <li><a href="/" className="hover:text-green-600 transition-colors">About</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-slate-800 font-semibold">Legal</p>
                        <ul className="mt-4 space-y-3">
                            <li><a href="/" className="hover:text-green-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="/" className="hover:text-green-600 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <p className="font-semibold text-slate-800">Follow us</p>
                    <div className="flex items-center gap-4">
                        <a href="#" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white border border-gray-200 hover:border-green-300 hover:text-green-600 transition-all shadow-sm">
                            <Linkedin className="size-4" />
                        </a>
                        <a href="#" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white border border-gray-200 hover:border-green-300 hover:text-green-600 transition-all shadow-sm">
                            <Twitter className="size-4" />
                        </a>
                        <a href="#" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white border border-gray-200 hover:border-green-300 hover:text-green-600 transition-all shadow-sm">
                            <Youtube className="size-4" />
                        </a>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">© 2026 ResumeBuilder. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </>
  )
}

export default Footer
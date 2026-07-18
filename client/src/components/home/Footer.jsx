import React from 'react'
import { Linkedin, Twitter, Youtube } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="relative bg-body border-t border-theme-light overflow-hidden py-16 px-6 md:px-16 lg:px-24 xl:px-32 text-sm">
      <div className="absolute inset-0 bg-linear-to-b from-violet-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex flex-wrap gap-12 lg:gap-20">
        <div className="flex flex-wrap flex-1 gap-10 md:gap-16">
          <div className="min-w-48">
            <div className='flex items-center gap-2.5'>
              <div className='size-8 rounded-lg gradient-btn flex items-center justify-center text-xs font-bold'>RB</div>
              <span className='text-dim font-medium'>ResumeBuilder</span>
            </div>
            <p className="mt-4 max-w-52 text-faint leading-relaxed">Making every job seeker feel confident with professional resume tools.</p>
          </div>
          <div>
            <p className="text-muted font-semibold">Product</p>
            <ul className="mt-4 space-y-3">
              <li><a href="/" className="text-faint hover:text-violet-400 transition-colors">Home</a></li>
              <li><a href="/" className="text-faint hover:text-violet-400 transition-colors">Features</a></li>
              <li><a href="/" className="text-faint hover:text-violet-400 transition-colors">Templates</a></li>
              <li><a href="/" className="text-faint hover:text-violet-400 transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <p className="text-muted font-semibold">Resources</p>
            <ul className="mt-4 space-y-3">
              <li><a href="/" className="text-faint hover:text-violet-400 transition-colors">Blog</a></li>
              <li><a href="/" className="text-faint hover:text-violet-400 transition-colors">Resume Tips</a></li>
              <li><a href="/" className="text-faint hover:text-violet-400 transition-colors">Support</a></li>
              <li><a href="/" className="text-faint hover:text-violet-400 transition-colors">About</a></li>
            </ul>
          </div>
          <div>
            <p className="text-muted font-semibold">Legal</p>
            <ul className="mt-4 space-y-3">
              <li><a href="/" className="text-faint hover:text-violet-400 transition-colors">Privacy Policy</a></li>
              <li><a href="/" className="text-faint hover:text-violet-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-muted font-semibold">Follow us</p>
          <div className="flex items-center gap-4">
            <a href="#" target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-glass-4 border border-theme-light hover:border-violet-500/30 hover:text-violet-400 hover:bg-violet-500/10 transition-all">
              <Linkedin className="size-4" />
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-glass-4 border border-theme-light hover:border-violet-500/30 hover:text-violet-400 hover:bg-violet-500/10 transition-all">
              <Twitter className="size-4" />
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-glass-4 border border-theme-light hover:border-violet-500/30 hover:text-violet-400 hover:bg-violet-500/10 transition-all">
              <Youtube className="size-4" />
            </a>
          </div>
          <p className="text-xs text-hidden mt-2">© 2026 ResumeBuilder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, Menu, X, Star, Zap } from 'lucide-react';

const Hero = () => {

  const { user } = useSelector(state => state.auth)
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08080f]">
      {/* Animated gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-linear-to-br from-violet-600/20 via-fuchsia-600/10 to-transparent blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-linear-to-br from-cyan-600/20 via-blue-600/10 to-transparent blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-linear-to-br from-amber-600/10 via-orange-600/10 to-transparent blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-50" />

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm">
        <div className='flex items-center gap-2.5'>
          <div className='size-9 rounded-xl gradient-btn flex items-center justify-center text-sm font-bold glow'>RB</div>
          <span className='text-white/50 font-medium'>ResumeBuilder</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-white/50 font-medium">
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#wall-of-love" className="hover:text-white transition-colors">Wall of Love</a>
          <a href="#cta" className="hover:text-white transition-colors">Contact</a>
        </div>

        <div className="flex gap-3">
          <Link to="/app?state=register" className="hidden md:flex gradient-btn px-6 py-2.5 rounded-xl text-sm glow" hidden={user}>
            Get started
          </Link>
          <Link to="/app?state=login" className="hidden md:flex px-6 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 active:scale-95 transition-all text-sm" hidden={user}>
            Sign in
          </Link>
          <Link to={'/app'} className='hidden md:flex gradient-btn px-6 py-2.5 rounded-xl text-sm glow' hidden={!user}>
            Dashboard
          </Link>
        </div>

        <button onClick={() => setMenuOpen(true)} className="md:hidden active:scale-90 transition p-2 rounded-lg hover:bg-white/5">
          <Menu className="size-5 text-white/60" />
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[#08080f]/95 backdrop-blur-xl flex flex-col items-center justify-center text-lg gap-8 md:hidden">
          <a href="#" onClick={() => setMenuOpen(false)} className="text-white/70 hover:text-white transition-colors">Home</a>
          <a href="#features" onClick={() => setMenuOpen(false)} className="text-white/70 hover:text-white transition-colors">Features</a>
          <a href="#wall-of-love" onClick={() => setMenuOpen(false)} className="text-white/70 hover:text-white transition-colors">Wall of Love</a>
          <a href="#cta" onClick={() => setMenuOpen(false)} className="text-white/70 hover:text-white transition-colors">Contact</a>
          <button onClick={() => setMenuOpen(false)} className="size-11 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/10 text-white/60">
            <X className="size-5" />
          </button>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative flex flex-col items-center justify-center px-4 md:px-16 lg:px-24 xl:px-40 pt-20 pb-32">

        {/* Social proof */}
        <div className="flex items-center gap-4 px-5 py-2.5 bg-white/4 backdrop-blur-xl rounded-full border border-white/6">
          <div className="flex -space-x-2">
            {['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100'].map((src, i) => (
              <img key={i} src={src} alt="" className="size-7 object-cover rounded-full border-2 border-[#08080f]" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array(5).fill(0).map((_, i) => (<Star key={i} className="size-3 fill-amber-400 text-amber-400" />))}
            </div>
            <span className="text-xs text-white/40 font-medium">Trusted by 10,000+ users</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold max-w-6xl text-center mt-12 leading-[1.1] text-balance">
          <span className="text-white">Land your dream job with </span>
          <span className="gradient-text">AI-powered</span>
          <br />
          <span className="text-white">Resume builder.</span>
        </h1>

        <p className="max-w-xl text-center text-base md:text-lg my-8 text-white/40 leading-relaxed">
          Create professional resumes in minutes with AI-powered assistance, real-time previews, and smart optimization.
        </p>

        {/* CTA */}
        <Link to='/app'
          className="gradient-btn rounded-xl px-9 h-13 flex items-center gap-2 text-lg shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 glow font-medium">
          Get started free
          <ArrowRight className="size-5" />
        </Link>

        {/* Stats bar */}
        <div className="mt-20 grid grid-cols-3 gap-8 md:gap-16">
          {[
            { value: '10K+', label: 'Resumes Created' },
            { value: '98%', label: 'Satisfaction Rate' },
            { value: '4.9', label: 'User Rating' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs text-white/30 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Company logos */}
        <div className="mt-20 w-full max-w-4xl mx-auto">
          <p className="text-center text-xs text-white/20 uppercase tracking-[0.2em] font-medium mb-8">Trusted by professionals at leading companies</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-20">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-24 rounded-lg bg-white/10 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero

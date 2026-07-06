import { Zap, Sparkles, Shield, FileText, BarChart3, Wand2, Download, ArrowRight } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';
import Title from './Title';

const Features = () => {
  const features = [
    {
      icon: Wand2,
      title: 'AI-Powered Writing',
      description: 'Generate compelling resume content with our advanced AI assistant that understands your industry.',
      gradient: 'from-violet-600 to-fuchsia-600',
      border: 'border-violet-500/20',
      bg: 'bg-violet-500/5',
    },
    {
      icon: FileText,
      title: 'Professional Templates',
      description: 'Choose from beautifully designed templates that are ATS-friendly and visually appealing.',
      gradient: 'from-cyan-600 to-blue-600',
      border: 'border-cyan-500/20',
      bg: 'bg-cyan-500/5',
    },
    {
      icon: BarChart3,
      title: 'ATS Score Analysis',
      description: 'Get real-time feedback on how well your resume matches job descriptions.',
      href: '/ats-analysis',
      gradient: 'from-amber-600 to-orange-600',
      border: 'border-amber-500/20',
      bg: 'bg-amber-500/5',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure. Share your resume only when you choose to.',
      gradient: 'from-emerald-600 to-teal-600',
      border: 'border-emerald-500/20',
      bg: 'bg-emerald-500/5',
    },
    {
      icon: Download,
      title: 'Multiple Export Formats',
      description: 'Download your resume as PDF, DOCX, HTML, or JSON for maximum flexibility.',
      gradient: 'from-rose-600 to-pink-600',
      border: 'border-rose-500/20',
      bg: 'bg-rose-500/5',
    },
    {
      icon: Sparkles,
      title: 'Real-Time Preview',
      description: 'See changes instantly with our live preview as you build your resume.',
      gradient: 'from-violet-600 to-cyan-600',
      border: 'border-violet-500/20',
      bg: 'bg-violet-500/5',
    }
  ];

  return (
    <div id='features' className='relative bg-[#08080f] py-28 px-4 scroll-mt-12 overflow-hidden'>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-br from-violet-600/5 via-fuchsia-600/5 to-cyan-600/5 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 text-sm text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-full px-5 py-2 font-medium">
            <Zap width={14} />
            <span>Powerful Features</span>
          </div>

          <Title title='Everything You Need' description='Our comprehensive toolkit helps you create a standout resume that gets noticed by employers and passes ATS systems.' />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto mt-14">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index}
                  className={`group relative p-6 rounded-2xl border ${feature.border} ${feature.bg} hover:bg-white/[0.04] transition-all duration-500 card-hover overflow-hidden`}>
                  <div className={`absolute top-0 right-0 size-32 bg-gradient-to-br ${feature.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2`} />
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="size-6 text-white" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
                    {feature.href && (
                      <Link to={feature.href} className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-amber-300 hover:text-amber-200">
                        Open analysis
                        <ArrowRight className="size-4" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features

import { Zap, Sparkles, Shield, FileText, BarChart3, Wand2, Download } from 'lucide-react';
import React from 'react'
import Title from './Title';

const Features = () => {
    const features = [
        {
            icon: Wand2,
            title: 'AI-Powered Writing',
            description: 'Generate compelling resume content with our advanced AI assistant that understands your industry.',
            color: 'violet',
            bg: 'bg-violet-50',
            border: 'border-violet-200',
            iconBg: 'bg-violet-100',
            iconColor: 'text-violet-600'
        },
        {
            icon: FileText,
            title: 'Professional Templates',
            description: 'Choose from beautifully designed templates that are ATS-friendly and visually appealing.',
            color: 'blue',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            icon: BarChart3,
            title: 'ATS Score Analysis',
            description: 'Get real-time feedback on how well your resume matches job descriptions.',
            color: 'green',
            bg: 'bg-green-50',
            border: 'border-green-200',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600'
        },
        {
            icon: Shield,
            title: 'Secure & Private',
            description: 'Your data is encrypted and secure. Share your resume only when you choose to.',
            color: 'orange',
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600'
        },
        {
            icon: Download,
            title: 'Multiple Export Formats',
            description: 'Download your resume as PDF, DOCX, HTML, or JSON for maximum flexibility.',
            color: 'purple',
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600'
        },
        {
            icon: Sparkles,
            title: 'Real-Time Preview',
            description: 'See changes instantly with our live preview as you build your resume.',
            color: 'pink',
            bg: 'bg-pink-50',
            border: 'border-pink-200',
            iconBg: 'bg-pink-100',
            iconColor: 'text-pink-600'
        }
    ];

  return (
    <div id='features' className='flex flex-col items-center my-20 px-4 scroll-mt-12'>

        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-full px-5 py-2 font-medium">
            <Zap width={14}/>
            <span>Powerful Features</span>
        </div>

        <Title title='Everything You Need' description='Our comprehensive toolkit helps you create a standout resume that gets noticed by employers and passes ATS systems.' />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
            {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                    <div key={index} className={`p-6 rounded-xl border border-gray-100 ${feature.bg} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default group`}>
                        <div className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <Icon className={`size-6 ${feature.iconColor}`} />
                        </div>
                        <h3 className="text-base font-semibold text-slate-800 mb-2">{feature.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                    </div>
                );
            })}
        </div>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        
            * {
                font-family: 'Poppins', sans-serif;
            }
        `}</style>
    </div>
  )
}

export default Features
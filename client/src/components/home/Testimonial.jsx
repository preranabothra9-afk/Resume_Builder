import React from 'react'
import Title from './Title'
import { BookUserIcon, Quote, Star } from 'lucide-react'

const Testimonial = () => {

  const cardsData = [
    {
      image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200',
      name: 'Briar Martin',
      handle: '@neilstellar',
      text: 'This resume builder helped me land my dream job at a top tech company. The AI suggestions were spot-on!',
    },
    {
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      name: 'Avery Johnson',
      handle: '@averywrites',
      text: 'I was struggling with my resume for weeks. This tool made it so easy and the results are professional.',
    },
    {
      image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200',
      name: 'Jordan Lee',
      handle: '@jordantalks',
      text: 'The ATS score feature is a game-changer. I could see exactly how my resume would perform before applying.',
    },
    {
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200',
      name: 'Taylor Smith',
      handle: '@taylorsmith',
      text: 'Created a polished resume in under 30 minutes. The templates are beautiful and the export options are great.',
    },
  ];

  const CreateCard = ({ card }) => (
    <div className="p-6 rounded-2xl mx-3 border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300 w-80 shrink-0">
      <Quote className="size-5 text-violet-400 mb-4 opacity-60" />
      <p className="text-sm text-white/60 leading-relaxed mb-5">{card.text}</p>
      <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
        <img className="size-10 rounded-full object-cover ring-2 ring-white/10" src={card.image} alt="" />
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-white/80">{card.name}</p>
            <Star className="size-3 fill-violet-500 text-violet-500" />
          </div>
          <span className="text-xs text-white/30">{card.handle}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div id='testimonials' className='relative bg-[#08080f] py-28 px-4 scroll-mt-12 overflow-hidden'>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-gradient-to-br from-fuchsia-600/5 via-violet-600/5 to-transparent rounded-full blur-[150px]" />

        <div className="relative flex flex-col items-center">
          <div className="flex items-center gap-2 text-sm text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-full px-5 py-2 font-medium">
            <BookUserIcon className='size-4' />
            <span>Testimonials</span>
          </div>

          <Title title="Loved by thousands" description="See what our users have to say about their experience." />
        </div>
      </div>

      <div className="relative bg-[#08080f] pb-28">
        <div className="marquee-row w-full mx-auto max-w-6xl overflow-hidden relative">
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-[#08080f] to-transparent" />
          <div className="marquee-inner flex transform-gpu min-w-[200%] pt-5 pb-5">
            {[...cardsData, ...cardsData].map((card, index) => (
              <CreateCard key={index} card={card} />
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-[#08080f] to-transparent" />
        </div>

        <div className="marquee-row w-full mx-auto max-w-6xl overflow-hidden relative">
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-[#08080f] to-transparent" />
          <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-5 pb-5">
            {[...cardsData, ...cardsData].map((card, index) => (
              <CreateCard key={index} card={card} />
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-[#08080f] to-transparent" />
        </div>

        <style>{`
          @keyframes marqueeScroll { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
          .marquee-inner { animation: marqueeScroll 30s linear infinite; }
          .marquee-reverse { animation-direction: reverse; }
        `}</style>
      </div>
    </>
  )
}

export default Testimonial

import React from 'react'
import Title from './Title'
import { BookUserIcon, Quote } from 'lucide-react'

const Testimonial = () => {

    const cardsData = [
        {
            image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
            name: 'Briar Martin',
            handle: '@neilstellar',
            text: 'This resume builder helped me land my dream job at a top tech company. The AI suggestions were spot-on!',
        },
        {
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
            name: 'Avery Johnson',
            handle: '@averywrites',
            text: 'I was struggling with my resume for weeks. This tool made it so easy and the results are professional.',
        },
        {
            image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
            name: 'Jordan Lee',
            handle: '@jordantalks',
            text: 'The ATS score feature is a game-changer. I could see exactly how my resume would perform before applying.',
        },
        {
            image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
            name: 'Taylor Smith',
            handle: '@taylorsmith',
            text: 'Created a polished resume in under 30 minutes. The templates are beautiful and the export options are great.',
        },
    ];

    const CreateCard = ({ card }) => (
        <div className="p-6 rounded-xl mx-3 shadow-sm border border-gray-100 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-80 shrink-0">
            <Quote className="size-5 text-green-500 mb-4 opacity-60" />
            <p className="text-sm text-gray-700 leading-relaxed mb-5">{card.text}</p>
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <img className="size-10 rounded-full object-cover" src={card.image} alt="User Image" />
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-slate-800">{card.name}</p>
                        <svg className="fill-green-500" width="14" height="14" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" />
                        </svg>
                    </div>
                    <span className="text-xs text-slate-500">{card.handle}</span>
                </div>
            </div>
        </div>
    );

  return (
    <>
        <div id='testimonials' className='flex flex-col items-center my-20 px-4 scroll-mt-12'>
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-full px-5 py-2 font-medium">
                <BookUserIcon className='size-4 stroke-green-600'/>
                <span>Testimonials</span>
            </div>

            <Title title="Loved by thousands" description="See what our users have to say about their experience. We're constantly improving based on your feedback." />

        </div>
        <div className="marquee-row w-full mx-auto max-w-6xl overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-gray-50 to-transparent"></div>
            <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5">
                {[...cardsData, ...cardsData].map((card, index) => (
                    <CreateCard key={index} card={card} />
                ))}
            </div>
            <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-gray-50 to-transparent"></div>
            </div>

            <div className="marquee-row w-full mx-auto max-w-6xl overflow-hidden relative">
                <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-gray-50 to-transparent"></div>
                <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-10 pb-5">
                    {[...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={index} card={card} />
                    ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-gray-50 to-transparent"></div>

                <style>{`
                    @keyframes marqueeScroll {
                        0% { transform: translateX(0%); }
                        100% { transform: translateX(-50%); }
                    }

                    .marquee-inner {
                        animation: marqueeScroll 30s linear infinite;
                    }

                    .marquee-reverse {
                        animation-direction: reverse;
                    }
                `}</style>
        </div>
    </>
  )
}

export default Testimonial
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, User, ExternalLink } from 'lucide-react';

const RegionCreatorsPage = ({ params }) => {

  const unwrappedParams = React.use(params);
  const regionId = unwrappedParams.id.toLowerCase(); 


  const allCreators = {
    japan: [
      { id: 101, name: 'Yuki Tanaka', role: 'Ceramic Artist', img: 'https://i.pravatar.cc/150?u=japan1' },
      { id: 102, name: 'Kenji Sato', role: 'Wood Sculptor', img: 'https://i.pravatar.cc/150?u=japan2' },
    ],
    usa: [
      { id: 201, name: 'John Doe', role: 'Digital Art', img: 'https://i.pravatar.cc/150?u=usa1' },
      { id: 202, name: 'Sarah Lee', role: 'Painter', img: 'https://i.pravatar.cc/150?u=usa2' },
    ],
    china: [
      { id: 301, name: 'Li Wei', role: 'Calligrapher', img: 'https://i.pravatar.cc/150?u=china1' },
    ],
    brazil: [
      { id: 401, name: 'Paulo Silva', role: 'Musician', img: 'https://i.pravatar.cc/150?u=brazil1' },
    ],
    italy: [
      { id: 501, name: 'Giovanni Rossi', role: 'Leather Artisan', img: 'https://i.pravatar.cc/150?u=italy1' },
      { id: 502, name: 'Sofia Moretti', role: 'Glass Blower', img: 'https://i.pravatar.cc/150?u=italy2' },
      { id: 503, name: 'Luca Ferrari', role: 'Sculptor', img: 'https://i.pravatar.cc/150?u=italy3' },
    ],
    morocco: [
      { id: 601, name: 'Amine El Fassi', role: 'Zellige Master', img: 'https://i.pravatar.cc/150?u=morocco1' },
      { id: 602, name: 'Fatima Zahra', role: 'Rug Weaver', img: 'https://i.pravatar.cc/150?u=morocco2' },
    ],
    egypt: [
      { id: 701, name: 'Ahmed Mansour', role: 'Papyrus Artist', img: 'https://i.pravatar.cc/150?u=egypt1' },
      { id: 702, name: 'Layla Hassan', role: 'Jewelry Designer', img: 'https://i.pravatar.cc/150?u=egypt2' },
    ],
    france: [
      { id: 801, name: 'Julien Bernard', role: 'Fashion Designer', img: 'https://i.pravatar.cc/150?u=france1' },
      { id: 802, name: 'Claire Lefebvre', role: 'Perfumer', img: 'https://i.pravatar.cc/150?u=france2' },
    ],
  };

  const creators = allCreators[regionId] || [];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Link */}
        <Link href="/regions" className="inline-flex items-center gap-2 text-[#F57C00] font-bold mb-10 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Regions
        </Link>

        {/* Region Header */}
        <div className="mb-16 border-l-4 border-[#F57C00] pl-6">
          <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white uppercase  tracking-tighter">
            {regionId} <span className="text-[#F57C00]">Masters</span>
          </h1>
          <p className="text-gray-500 text-lg mt-4 max-w-xl">
            Meet the iconic creators from {regionId} who are redefining traditional craft and modern art.
          </p>
        </div>

        {/* Creators Grid */}
        {creators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {creators.map((c) => (
              <div 
                key={c.id} 
                className="group relative flex flex-col p-8 bg-gray-50 dark:bg-zinc-900/40 rounded-[2.5rem] border border-transparent hover:border-[#F57C00]/30 transition-all duration-500 overflow-hidden"
              >
                {/* Background Decoration */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#F57C00]/5 rounded-full blur-2xl group-hover:bg-[#F57C00]/10 transition-colors" />

                <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                <Image 
                src={c.img} 
                alt={c.name} 
                fill 
                className="object-cover"
                sizes="(max-width: 96px) 100vw, 96px"
                unoptimized 
                />
                </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                      {c.name}
                    </h3>
                    <p className="text-[#F57C00] text-xs font-black uppercase tracking-[0.2em]">
                      {c.role}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <Link href={`/become-creator?creator=${c.name.toLowerCase().replace(/\s+/g, '-')}`} className="flex-1">
                    <button className="w-full py-4 bg-[#F57C00] dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase hover:bg-[#F57C00] dark:hover:bg-[#F57C00] dark:hover:text-white transition-all shadow-lg flex items-center justify-center gap-2">
                      View Profile <ExternalLink size={14} />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 rounded-[3rem] bg-zinc-50 dark:bg-zinc-900/20 border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <User size={48} className="mx-auto text-zinc-300 mb-4" />
            <h2 className="text-xl font-bold text-zinc-400">No creators found for this land.</h2>
            <Link href="/regions" className="text-[#F57C00] underline mt-2 block">Go back and select another</Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default RegionCreatorsPage;
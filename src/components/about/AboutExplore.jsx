import React from 'react';
import { Palette, Users, ExternalLink } from 'lucide-react';

const AboutExplore = () => {
    const steps = [
        {
            id: '01',
            title: 'Discover curated works',
            description: 'Browse a meticulously curated selection of cultural works, filtered by heritage, technique, and region.',
            icon: <Palette className="w-10 h-10 text-[#E65100]" />,
        },
        {
            id: '02',
            title: 'Explore creator stories',
            description: 'Every object has a lineage. Go beyond the surface to understand the history and the hands behind the craft.',
            icon: <Users className="w-10 h-10 text-[#E65100]" />,
        },
        {
            id: '03',
            title: "Visit the creator's site",
            description: "We connect, we don't capture. Visit the creator's own platform to complete your journey and support them directly.",
            icon: <ExternalLink className="w-10 h-10 text-[#E65100]" />,
        }
    ];

    return (
        <section className="bg-white dark:bg-[#0a0a0a] py-16 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h3 className="text-2xl md:text-3xl font-light text-gray-700 dark:text-white mb-4">
                        The Explorer's Journey
                    </h3>
                    <div className="w-20 h-1 bg-[#E65100] mx-auto rounded-full"></div>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                    {steps.map((step) => (
                        <div key={step.id} className="space-y-6 group p-6 bg-gray-50 dark:bg-[#121212] rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">

                            {/* Step Number */}
                            <div className="flex items-center gap-4">
                                <span className="text-[#E65100] font-bold text-sm tracking-widest">{step.id}</span>
                                <div className="h-[1px] flex-grow bg-gray-200 dark:bg-zinc-800"></div>
                            </div>

                            {/* Icon */}
                            <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                                {step.icon}
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <h3 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-white">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutExplore;
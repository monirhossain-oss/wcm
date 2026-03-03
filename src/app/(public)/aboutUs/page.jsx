import AboutContent from '@/components/about/AboutContent';
import AboutCulture from '@/components/about/AboutCulture';
import AboutExplore from '@/components/about/AboutExplore';
import AboutPresting from '@/components/about/AboutPresting';
import AboutPrincpals from '@/components/about/AboutPrincpals';
import AboutShape from '@/components/about/AboutShape';
import AboutVisibility from '@/components/about/AboutVisibility';

import React from 'react';

const page = () => {
    return (
        <div>
            <AboutContent/>
            <AboutShape/>
            <AboutExplore/>
            <AboutCulture/>
            <AboutPresting/>
            <AboutPrincpals/>
            <AboutVisibility/>
        </div>
    );
};

export default page;
import AboutContent from '@/components/about/AboutContent';
import AboutCulture from '@/components/about/AboutCulture';
import AboutExplore from '@/components/about/AboutExplore';
import AboutPresting from '@/components/about/AboutPresting';
import AboutShape from '@/components/about/AboutShape';

import React from 'react';

const page = () => {
    return (
        <div>
            <AboutContent/>
            <AboutShape/>
            <AboutExplore/>
            <AboutCulture/>
            <AboutPresting/>
        </div>
    );
};

export default page;
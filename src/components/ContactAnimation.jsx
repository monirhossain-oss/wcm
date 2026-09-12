'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// The player itself is only ever needed once this component decides to draw something.
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// The decorative panel on the contact page. Its container is `hidden lg:flex`, so below that width
// it is never painted — yet a static import put both the player and its 60 KB animation in the
// first chunk of the page for every visitor, phones included, which is where the performance score
// is worst. Both are fetched here instead, and only on a viewport wide enough to show them.
const ContactAnimation = () => {
    const [animation, setAnimation] = useState(null);

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
        if (!window.matchMedia('(min-width: 1024px)').matches) return undefined;

        let active = true;
        import('../../public/animation/contact.json')
            .then((module) => { if (active) setAnimation(module.default); })
            // A failed chunk load leaves the panel empty rather than breaking the contact form.
            .catch(() => {});
        return () => { active = false; };
    }, []);

    if (!animation) return null;
    return <Lottie animationData={animation} loop autoplay />;
};

export default ContactAnimation;

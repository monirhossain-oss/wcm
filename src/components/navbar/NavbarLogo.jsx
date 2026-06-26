// src/components/navbar/NavbarLogo.jsx
// ⚠️ NO 'use client' here — fully static, no hooks, no handlers.
// Stays a Server Component; ships zero extra JS to the client.

import Image from 'next/image';
import Link from 'next/link';

const NavbarLogo = () => {
    return (
        <Link href="/" className="cursor-pointer">
            <Image
                src="/wc,-web-logo.png"
                alt="Logo Light"
                width={100}
                height={100}
                priority
                className="dark:hidden brightness-125 w-[80px] md:w-[130px] h-auto"
            />
            <Image
                src="/wc,-web-white.png"
                alt="Logo Dark"
                width={100}
                height={100}
                priority
                className="hidden dark:block brightness-125 w-[80px] md:w-[130px] h-auto"
            />
        </Link>
    );
};

export default NavbarLogo;
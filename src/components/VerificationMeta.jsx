'use client';

import { useEffect, useState } from 'react';
import { getVerifications } from '@/lib/api';

export default function VerificationMeta() {
    const [verifications, setVerifications] = useState([]);

    useEffect(() => {
        getVerifications().then(data => setVerifications(data));
    }, []);

    return (
        <>
            {verifications.map((v) => (
                <meta key={v._id} name={v.metaName} content={v.content} />
            ))}
        </>
    );
}
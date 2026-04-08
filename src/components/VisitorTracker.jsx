'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        let visitorId = localStorage.getItem('visitorId');
        if (!visitorId) {
          visitorId = uuidv4();
          localStorage.setItem('visitorId', visitorId);
        }

        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/views/track`, {
          visitorId,
          device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
          os: navigator.platform,
        });
      } catch (error) {
        console.error('Analytics error:', error);
      }
    };

    trackVisit();
  }, []);

  return null;
}

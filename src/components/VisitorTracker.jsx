'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        if (localStorage.getItem('is_tracked')) return;

        let visitorId = localStorage.getItem('visitorId');
        if (!visitorId) {
          visitorId = uuidv4();
          localStorage.setItem('visitorId', visitorId);
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/views/track`,
          {
            visitorId,
            device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
            os: navigator.platform,
          },
          { withCredentials: true } 
        );

        if (response.data.success) {
          localStorage.setItem('is_tracked', 'true');
        }
      } catch (error) {
        if (error.response?.status === 200) {
          localStorage.setItem('is_tracked', 'true');
        }
        console.error('Analytics error:', error.message);
      }
    };

    trackVisit();
  }, []);

  return null;
}

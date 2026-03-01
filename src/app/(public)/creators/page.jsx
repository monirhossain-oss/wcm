'use client';

import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const creators = [
  { id: 1, name: 'Amadou Diallo', description: 'Wood sculptor from Senegal preserving West African carving traditions.', culture: 'Mandinka', region: 'West Africa', initials: 'AD', hue: '#C0392B' },
  { id: 2, name: 'Carlos Quispe', description: 'Fiber artist from Cusco, Peru working with highland alpaca herding communities.', culture: 'Quechua', region: 'South America', initials: 'CQ', hue: '#1A6B4A' },
  { id: 3, name: 'Elif Yılmaz', description: 'Glass mosaic artist from Istanbul, Turkey, inspired by Ottoman and Byzantine artistry.', culture: 'Ottoman', region: 'Middle East', initials: 'EY', hue: '#7B3FA0' },
  { id: 4, name: 'Hassan El Fassi', description: 'Leather artisan from Fez, Morocco, carrying forward centuries-old tanning and embossing techniques.', culture: 'Moroccan', region: 'North Africa', initials: 'HE', hue: '#B8860B' },
  { id: 5, name: 'Kwame Asante', description: 'Master weaver from Kumasi, Ghana with 20+ years preserving Ashanti textile traditions.', culture: 'Ashanti', region: 'West Africa', initials: 'KA', hue: '#2E5A9C' },
  { id: 6, name: 'María López', description: 'Third-generation Barro Negro artisan from Oaxaca, Mexico.', culture: 'Zapotec', region: 'Latin America', initials: 'ML', hue: '#8B4513' },
  { id: 7, name: 'Priya Sharma', description: 'Textile designer from Jaipur, India dedicated to preserving block printing traditions.', culture: 'Rajasthani', region: 'South Asia', initials: 'PS', hue: '#C0392B' },
  { id: 8, name: 'Yuki Tanaka', description: 'Ceramic artist based in Kyoto, trained in the Raku tradition for over 15 years.', culture: 'Japanese', region: 'East Asia', initials: 'YT', hue: '#2C7873' },
];

const Diamond = ({ size = 10, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" fill="none" className={className}>
    <rect x="5" y="0.5" width="6.5" height="6.5" rx="0.5" transform="rotate(45 5 0.5)" stroke="currentColor" strokeWidth="1" fill="none" />
  </svg>
);

export default function CreatorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState(null);

  const filtered = creators.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.culture.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'transparent',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        .pf { font-family: 'Playfair Display', Georgia, serif; }
        .dm { font-family: 'DM Sans', system-ui, sans-serif; }

        .creator-card {
          position: relative;
          background: #fff;
          border: 1.5px solid #E8E0D5;
          border-radius: 20px;
          padding: 28px;
          cursor: pointer;
          transition: transform 0.25s ease, border-color 0.25s ease;
          overflow: hidden;
        }
        .creator-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 4px;
          background: linear-gradient(90deg, var(--hue), #E07B39);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .creator-card:hover::before { transform: scaleX(1); }
        .creator-card:hover {
          transform: translateY(-3px);
          border-color: #D4C8B8;
        }
        .creator-card:hover .creator-name { color: #E07B39; }

        .avatar-ring {
          width: 64px; height: 64px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; font-weight: 800; color: #fff;
          flex-shrink: 0;
          position: relative;
        }
        .avatar-ring::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 2px dashed;
          border-color: var(--hue);
          opacity: 0.4;
          animation: spin 12s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .tag {
          display: inline-flex; align-items: center;
          padding: 3px 12px;
          border-radius: 100px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
          background: transparent;
          color: #5A4A3A;
          border: 1px solid #E8E0D5;
        }

        .search-wrap {
          position: relative;
          max-width: 420px;
        }
        .search-input {
          width: 100%;
          padding: 14px 20px 14px 48px;
          border-radius: 100px;
          border: 2px solid #E8E0D5;
          background: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500; color: #1C2B4A;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-shadow: none;
        }
        .search-input:focus {
          border-color: #E07B39;
          box-shadow: 0 0 0 4px rgba(224,123,57,0.12);
        }
        .search-icon {
          position: absolute; left: 18px; top: 50%; transform: translateY(-50%);
          color: #9C8A78; font-size: 18px; pointer-events: none;
        }

        .count-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #1C2B4A; color: #fff;
          padding: 6px 16px; border-radius: 100px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.04em;
        }

        .section-rule {
          display: flex; align-items: center; gap: 12px; margin-bottom: 36px;
        }
        .rule-line { flex: 1; height: 1px; background: #DDD5C8; }
      `}</style>

      {/* ===== HERO HEADER ===== */}
      <div style={{ background: '#1C2B4A', padding: '52px 48px 48px', position: 'relative', overflow: 'hidden' }}>
        {/* Corner diamonds */}
        <div style={{ position: 'absolute', top: 24, left: 32, display: 'flex', gap: 10 }}>
          {[0,1,2].map(i => <Diamond key={i} size={12} className="" style={{ color: '#4A6090', opacity: 0.6 }} />)}
        </div>
        <div style={{ position: 'absolute', top: 24, right: 32, display: 'flex', gap: 10 }}>
          {[0,1,2].map(i => <Diamond key={i} size={12} />)}
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <p className="dm" style={{ color: '#E07B39', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
                ◆ &nbsp;World Culture Marketplace
              </p>
              <h1 className="pf" style={{ color: '#fff', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, lineHeight: 1.1, margin: 0 }}>
                Creators Directory
              </h1>
              <p className="dm" style={{ color: '#8FA3C8', fontSize: 15, marginTop: 12, fontWeight: 500 }}>
                Meet the artisans preserving and sharing cultural traditions worldwide.
              </p>
            </div>

            <div className="count-badge dm">
              <span style={{ fontSize: 20, fontWeight: 900 }}>{creators.length}</span>
              <span style={{ opacity: 0.7 }}>Artisans</span>
            </div>
          </div>

          {/* Search */}
          <div style={{ marginTop: 36 }} className="search-wrap">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, culture, or region..."
              className="search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ===== GRID ===== */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px' }}>
        <div className="section-rule">
          <div className="rule-line" />
          <span className="dm" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9C8A78' }}>
            {filtered.length} results
          </span>
          <div className="rule-line" />
        </div>

        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {filtered.map((creator) => (
              <div
                key={creator.id}
                className="creator-card"
                style={{ '--hue': creator.hue }}
                onMouseEnter={() => setHoveredId(creator.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                  {/* Avatar */}
                  <div
                    className="avatar-ring dm"
                    style={{ '--hue': creator.hue, background: creator.hue }}
                  >
                    {creator.initials}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      className="creator-name pf"
                      style={{ fontSize: 20, fontWeight: 800, color: '#1C2B4A', margin: 0, lineHeight: 1.2, transition: 'color 0.2s' }}
                    >
                      {creator.name}
                    </h3>
                    <p
                      className="dm"
                      style={{ fontSize: 13, color: '#7A6A5A', lineHeight: 1.6, margin: '8px 0 14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {creator.description}
                    </p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className="tag">◆ {creator.culture}</span>
                      <span className="tag">{creator.region}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom arrow hint */}
                <div style={{
                  marginTop: 20, paddingTop: 16,
                  borderTop: '1px solid #F0EAE0',
                  display: 'flex', justifyContent: 'flex-end'
                }}>
                  <span className="dm" style={{ fontSize: 11, fontWeight: 700, color: hoveredId === creator.id ? '#E07B39' : '#C0B0A0', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'color 0.2s' }}>
                    View Profile →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center', padding: '80px 40px',
            border: '2px dashed #DDD5C8', borderRadius: 24,
            background: '#FAF8F4'
          }}>
            <p className="pf" style={{ fontSize: 32, color: '#C0B0A0', margin: 0 }}>No creators found</p>
            <p className="dm" style={{ fontSize: 14, color: '#9C8A78', marginTop: 8 }}>Try a different name, culture, or region.</p>
          </div>
        )}
      </div>
    </div>
  );
}
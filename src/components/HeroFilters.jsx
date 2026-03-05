'use client';
import React, { useState } from 'react';
import { FaUtensils, FaChevronDown, FaGlobe, FaTheaterMasks } from 'react-icons/fa';

export default function HeroFilters({ initialFilters = {}, onFilterChange }) {
  // Local state, user selection handle করবে
  const [filters, setFilters] = useState(initialFilters);

  const handleChange = (id, value) => {
    const newFilters = { ...filters, [id]: value };
    setFilters(newFilters);
    if (onFilterChange) onFilterChange(id, value);
  };

  const filterOptions = [
    { id: 'category', icon: <FaUtensils />, label: 'Category', options: ['Art & Sculpture', 'Fashion', 'Music'] },
    { id: 'region', icon: <FaGlobe />, label: 'Region', options: ['Asia', 'Europe', 'Africa'] },
    { id: 'tradition', icon: <FaTheaterMasks />, label: 'Cultural', options: ['Jamdami', 'Modern', 'Fusion'] },
  ];

  return (
    <div className="max-w-4xl w-full mx-auto mt-4 py-4 flex flex-col md:flex-row gap-4">
      {filterOptions.map((filter) => (
        <div key={filter.id} className="relative w-full md:w-1/3">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 z-10">{filter.icon}</span>

          <select
            value={filters[filter.id] || ''}
            onChange={(e) => handleChange(filter.id, e.target.value)}
            className="w-full bg-white/20 backdrop-blur-xl px-12 py-4 rounded-full text-white appearance-none border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#F57C00] transition-all cursor-pointer font-medium"
          >
            <option value="">All {filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt} value={opt} className="bg-gray-800 text-white">{opt}</option>
            ))}
          </select>

          <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 z-10" />
        </div>
      ))}
    </div>
  );
}
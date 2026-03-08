'use client';
import { createContext, useContext, useState } from 'react';

const ListingsContext = createContext();

export const ListingsProvider = ({ children }) => {
    const [cachedListings, setCachedListings] = useState([]);
    return (
        <ListingsContext.Provider value={{ cachedListings, setCachedListings }}>
            {children}
        </ListingsContext.Provider>
    );
};

export const useListings = () => useContext(ListingsContext);
import React, { createContext, useState, useContext } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const resetFilter = () => setSelectedCategory(null);

    return (
        <FilterContext.Provider value={{ selectedCategory, setSelectedCategory, resetFilter }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
};

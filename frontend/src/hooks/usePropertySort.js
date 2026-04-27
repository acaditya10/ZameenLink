import { useState, useCallback } from 'react';

export const usePropertySort = () => {
    const [currentSort, setCurrentSort] = useState('price-asc');

    const sortProperties = useCallback((properties, sortId) => {
        let sorted = [...properties];

        switch (sortId) {
            case 'price-asc':
                sorted.sort((a, b) => a.actual_fair_value - b.actual_fair_value);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.actual_fair_value - a.actual_fair_value);
                break;
            case 'size-asc':
                sorted.sort((a, b) => a.plot_size_sqft - b.plot_size_sqft);
                break;
            case 'size-desc':
                sorted.sort((a, b) => b.plot_size_sqft - a.plot_size_sqft);
                break;
            case 'area-asc':
                sorted.sort((a, b) => a.area_name.localeCompare(b.area_name));
                break;
            case 'bhk-asc':
                sorted.sort((a, b) => a.bhk - b.bhk);
                break;
            case 'bhk-desc':
                sorted.sort((a, b) => b.bhk - a.bhk);
                break;
            default:
                break;
        }

        return sorted;
    }, []);

    const handleSortChange = useCallback((sortId) => {
        setCurrentSort(sortId);
    }, []);

    return {
        currentSort,
        sortProperties,
        handleSortChange
    };
};

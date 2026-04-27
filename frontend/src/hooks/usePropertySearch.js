import { useState, useCallback } from 'react';

export const usePropertySearch = (allProperties) => {
    const [searchQuery, setSearchQuery] = useState('');

    const searchProperties = useCallback((query) => {
        if (!query || !query.trim()) {
            return allProperties;
        }

        return allProperties.filter(p =>
            p.area_name.toLowerCase().includes(query.toLowerCase())
        );
    }, [allProperties]);

    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    return {
        searchQuery,
        searchProperties,
        handleSearch
    };
};

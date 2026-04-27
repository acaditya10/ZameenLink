import { useState, useMemo, useCallback } from 'react';

export const usePropertyFilters = (allProperties) => {
    const [filters, setFilters] = useState({
        priceRange: { min: 0, max: 50000000 },
        bhk: [],
        areas: []
    });

    // Calculate price range from properties
    const [priceMin, priceMax] = useMemo(() => {
        if (!allProperties || allProperties.length === 0) return [0, 50000000];
        const prices = allProperties.map(p => p.actual_fair_value);
        return [
            Math.floor(Math.min(...prices) / 1000000) * 1000000,
            Math.ceil(Math.max(...prices) / 1000000) * 1000000
        ];
    }, [allProperties]);

    // Get unique areas
    const uniqueAreas = useMemo(() => {
        if (!allProperties) return [];
        return [...new Set(allProperties.map(p => p.area_name))].sort();
    }, [allProperties]);

    // Get unique BHK values
    const uniqueBHK = useMemo(() => {
        if (!allProperties) return [];
        return [...new Set(allProperties.map(p => p.bhk))].sort((a, b) => a - b);
    }, [allProperties]);

    // Apply filters to properties
    const filteredProperties = useMemo(() => {
        let filtered = [...allProperties];

        // Apply price filter
        if (filters.priceRange) {
            filtered = filtered.filter(p =>
                p.actual_fair_value >= filters.priceRange.min &&
                p.actual_fair_value <= filters.priceRange.max
            );
        }

        // Apply BHK filter
        if (filters.bhk && filters.bhk.length > 0) {
            filtered = filtered.filter(p => filters.bhk.includes(p.bhk));
        }

        // Apply area filter
        if (filters.areas && filters.areas.length > 0) {
            filtered = filtered.filter(p => filters.areas.includes(p.area_name));
        }

        return filtered;
    }, [allProperties, filters]);

    // Calculate active filter count
    const activeFilterCount = useMemo(() => {
        return filters.bhk.length + filters.areas.length +
            ((filters.priceRange.min !== priceMin || filters.priceRange.max !== priceMax) ? 1 : 0);
    }, [filters, priceMin, priceMax]);

    // Reset filters
    const resetFilters = useCallback(() => {
        setFilters({
            priceRange: { min: priceMin, max: priceMax },
            bhk: [],
            areas: []
        });
    }, [priceMin, priceMax]);

    // Update filters
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    return {
        filters,
        filteredProperties,
        uniqueAreas,
        uniqueBHK,
        priceMin,
        priceMax,
        activeFilterCount,
        updateFilters,
        resetFilters
    };
};

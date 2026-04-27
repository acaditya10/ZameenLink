import React, { useState, useEffect } from 'react';
import { formatPrice } from '../utils/formatters';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';

const FilterPanel = ({ properties, onFilterChange, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        priceRange: { min: 0, max: 50000000 },
        bhk: [],
        areas: []
    });

    // Calculate price range from properties
    const [priceMin, priceMax] = React.useMemo(() => {
        if (!properties || properties.length === 0) return [0, 50000000];
        const prices = properties.map(p => p.actual_fair_value);
        return [Math.floor(Math.min(...prices) / 1000000) * 1000000, Math.ceil(Math.max(...prices) / 1000000) * 1000000];
    }, [properties]);

    // Get unique areas
    const uniqueAreas = React.useMemo(() => {
        if (!properties) return [];
        return [...new Set(properties.map(p => p.area_name))].sort();
    }, [properties]);

    // Get unique BHK values
    const uniqueBHK = React.useMemo(() => {
        if (!properties) return [];
        return [...new Set(properties.map(p => p.bhk))].sort((a, b) => a - b);
    }, [properties]);

    // Initialize price range
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            priceRange: { min: priceMin, max: priceMax }
        }));
    }, [priceMin, priceMax]);

    const handlePriceChange = (type, value) => {
        const newFilters = {
            ...filters,
            priceRange: {
                ...filters.priceRange,
                [type]: parseInt(value)
            }
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleBHKChange = (bhk) => {
        const newBHKs = filters.bhk.includes(bhk)
            ? filters.bhk.filter(b => b !== bhk)
            : [...filters.bhk, bhk];

        const newFilters = { ...filters, bhk: newBHKs };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleAreaChange = (area) => {
        const newAreas = filters.areas.includes(area)
            ? filters.areas.filter(a => a !== area)
            : [...filters.areas, area];

        const newFilters = { ...filters, areas: newAreas };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const defaultFilters = {
            priceRange: { min: priceMin, max: priceMax },
            bhk: [],
            areas: []
        };
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    const activeFilterCount = filters.bhk.length + filters.areas.length +
        ((filters.priceRange.min !== priceMin || filters.priceRange.max !== priceMax) ? 1 : 0);

    return (
        <div className={`relative ${className}`}>
            {/* Filter Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-lg shadow-sm hover:bg-sand-100 transition-all duration-200 h-[42px] focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
                aria-label="Open filter panel"
                aria-expanded={isOpen}
            >
                <SlidersHorizontal className="w-4 h-4 text-charcoal-500" />
                <span className="font-medium text-charcoal-500 text-sm">Filters</span>
                {activeFilterCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-forest-500 text-sand-50 text-xs font-semibold rounded-full">
                        {activeFilterCount}
                    </span>
                )}
            </button>

            {/* Filter Panel */}
            {isOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-charcoal-500/20 backdrop-blur-sm z-[1000]"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Panel - Centered Modal */}
                    <div
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-[90%] max-w-md bg-sand-50 rounded-xl shadow-2xl z-[1001] border border-sand-300 overflow-hidden"
                        role="dialog"
                        aria-label="Filter properties"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-sand-300 bg-sand-100">
                            <h3 className="font-semibold text-charcoal-500 flex items-center gap-2">
                                <SlidersHorizontal className="w-5 h-5 text-forest-500" />
                                Filter Properties
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-sand-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-forest-500"
                                aria-label="Close filter panel"
                            >
                                <X className="w-5 h-5 text-charcoal-500" />
                            </button>
                        </div>

                        <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Price Range Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-charcoal-500 mb-3">
                                    Price Range
                                </label>
                                <div className="space-y-3">
                                    <div>
                                        <label htmlFor="price-min" className="block text-xs text-sand-700 mb-1">
                                            Minimum: {formatPrice(filters.priceRange.min)}
                                        </label>
                                        <input
                                            id="price-min"
                                            type="range"
                                            min={priceMin}
                                            max={priceMax}
                                            step={500000}
                                            value={filters.priceRange.min}
                                            onChange={(e) => handlePriceChange('min', e.target.value)}
                                            className="w-full h-2 bg-sand-300 rounded-lg appearance-none cursor-pointer accent-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
                                            aria-label="Minimum price filter"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="price-max" className="block text-xs text-sand-700 mb-1">
                                            Maximum: {formatPrice(filters.priceRange.max)}
                                        </label>
                                        <input
                                            id="price-max"
                                            type="range"
                                            min={priceMin}
                                            max={priceMax}
                                            step={500000}
                                            value={filters.priceRange.max}
                                            onChange={(e) => handlePriceChange('max', e.target.value)}
                                            className="w-full h-2 bg-sand-300 rounded-lg appearance-none cursor-pointer accent-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
                                            aria-label="Maximum price filter"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* BHK Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-charcoal-500 mb-3">
                                    BHK
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {uniqueBHK.map((bhk) => (
                                        <button
                                            key={bhk}
                                            onClick={() => handleBHKChange(bhk)}
                                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${filters.bhk.includes(bhk)
                                                ? 'bg-forest-500 text-sand-50 shadow-md'
                                                : 'bg-sand-200 text-charcoal-500 hover:bg-sand-300'
                                                }`}
                                            aria-pressed={filters.bhk.includes(bhk)}
                                            aria-label={`Filter by ${bhk} BHK`}
                                        >
                                            {bhk} BHK
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Area Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-charcoal-500 mb-3">
                                    Locality ({filters.areas.length} selected)
                                </label>
                                <div className="max-h-48 overflow-y-auto border border-sand-300 rounded-lg">
                                    {uniqueAreas.map((area) => (
                                        <label
                                            key={area}
                                            className="flex items-center gap-3 p-3 hover:bg-sand-100 cursor-pointer border-b border-sand-200 last:border-0 transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={filters.areas.includes(area)}
                                                onChange={() => handleAreaChange(area)}
                                                className="w-4 h-4 text-forest-500 rounded focus:ring-forest-500 focus:ring-2 focus:ring-offset-2"
                                                aria-label={`Filter by ${area}`}
                                            />
                                            <span className="text-sm text-charcoal-500">{area}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-sand-300 bg-sand-100 flex gap-2">
                            <button
                                onClick={handleReset}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-sand-50 border border-sand-300 rounded-lg hover:bg-sand-200 transition-all duration-200 font-medium text-charcoal-500 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
                                aria-label="Reset all filters"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 px-4 py-2 bg-forest-500 text-sand-50 rounded-lg hover:bg-forest-600 transition-all duration-200 font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FilterPanel;

import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Check } from 'lucide-react';

const SortOptions = ({ onSortChange, currentSort, className = '' }) => {
    const sortOptions = [
        { id: 'price-asc', label: 'Price: Low to High', icon: ArrowUp },
        { id: 'price-desc', label: 'Price: High to Low', icon: ArrowDown },
        { id: 'size-asc', label: 'Size: Small to Large', icon: ArrowUp },
        { id: 'size-desc', label: 'Size: Large to Small', icon: ArrowDown },
        { id: 'area-asc', label: 'Locality (A-Z)', icon: ArrowUp },
        { id: 'bhk-asc', label: 'BHK: Low to High', icon: ArrowUp },
        { id: 'bhk-desc', label: 'BHK: High to Low', icon: ArrowDown }
    ];

    const getCurrentLabel = () => {
        const option = sortOptions.find(opt => opt.id === currentSort);
        return option ? option.label : 'Sort By';
    };

    return (
        <div className={`relative group ${className}`}>
            {/* Trigger Button */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl shadow-sm hover:bg-sand-100 hover:border-sand-400 transition-all duration-200 cursor-pointer h-[42px] min-w-[180px] sm:min-w-[220px] focus:outline-none focus:ring-2 focus:ring-forest-500">
                <ArrowUpDown className="w-4 h-4 text-charcoal-500" />
                <span className="font-medium text-charcoal-500 text-xs sm:text-sm whitespace-nowrap">{getCurrentLabel()}</span>
                <svg
                    className="w-4 h-4 ml-1 text-charcoal-500 transition-transform group-hover:rotate-180 duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute top-full right-0 mt-2 w-full bg-sand-50 rounded-xl shadow-2xl border border-sand-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1001] overflow-hidden">
                {/* Header */}
                <div className="px-4 py-2.5 bg-gradient-to-r from-sand-100 to-sand-200 border-b border-sand-300">
                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-forest-600" />
                        <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wide">Sort By</span>
                    </div>
                </div>

                {/* Options */}
                <div className="py-1 max-h-[400px] overflow-y-auto" role="menu" aria-label="Sort options">
                    {sortOptions.map((option, index) => {
                        const Icon = option.icon;
                        const isSelected = currentSort === option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() => onSortChange(option.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 focus:outline-none focus:bg-sand-100 ${isSelected
                                    ? 'bg-gradient-to-r from-forest-50 to-forest-100 text-forest-800 font-semibold border-l-4 border-forest-600'
                                    : 'text-charcoal-500 hover:bg-sand-100 border-l-4 border-transparent'
                                    } ${index !== 0 ? 'border-t border-sand-200' : ''}`}
                                role="menuitem"
                                aria-label={`Sort by ${option.label}`}
                                aria-current={isSelected ? 'true' : 'false'}
                            >
                                <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-forest-600' : 'text-sand-700'}`} />
                                <span className="text-xs sm:text-sm flex-1">{option.label}</span>
                                {isSelected && (
                                    <Check className="w-4 h-4 text-forest-600 flex-shrink-0" strokeWidth={3} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SortOptions;

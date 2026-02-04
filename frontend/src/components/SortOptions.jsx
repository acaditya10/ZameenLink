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
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer h-[42px] min-w-[220px]">
                <ArrowUpDown className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-700 text-sm whitespace-nowrap">{getCurrentLabel()}</span>
                <svg
                    className="w-4 h-4 ml-1 text-gray-600 transition-transform group-hover:rotate-180 duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute top-full right-0 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1001] overflow-hidden">
                {/* Header */}
                <div className="px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-gray-600" />
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Sort By</span>
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
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 ${isSelected
                                    ? 'bg-gradient-to-r from-forest-50 to-forest-100 text-forest-800 font-semibold border-l-4 border-forest-600'
                                    : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                                    } ${index !== 0 ? 'border-t border-gray-100' : ''}`}
                                role="menuitem"
                                aria-label={`Sort by ${option.label}`}
                                aria-current={isSelected ? 'true' : 'false'}
                            >
                                <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-forest-600' : 'text-gray-500'}`} />
                                <span className="text-sm flex-1">{option.label}</span>
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

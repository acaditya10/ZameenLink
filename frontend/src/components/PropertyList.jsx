import React from 'react';
import { formatPrice } from '../utils/formatters';
import { ChevronLeft, ChevronRight, MapPin, Home, Maximize2 } from 'lucide-react';

function PropertyList({ properties, selectedProperty, onPropertySelect, isOpen, onToggle }) {
    return (
        <div className={`relative h-full bg-sand-50 border-r border-sand-300 shadow-lg transition-all duration-300 ${isOpen ? 'w-72 sm:w-80' : 'w-0'}`}>
            {/* Toggle Button - Centered */}
            <button
                onClick={onToggle}
                className="absolute -right-10 top-1/2 -translate-y-1/2 z-[1100] bg-sand-50 border border-sand-300 rounded-r-lg px-2 py-3 hover:bg-sand-100 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                aria-label={isOpen ? 'Close property list' : 'Open property list'}
                aria-expanded={isOpen}
            >
                {isOpen ? (
                    <ChevronLeft className="w-5 h-5 text-charcoal-500" />
                ) : (
                    <ChevronRight className="w-5 h-5 text-charcoal-500" />
                )}
            </button>

            {/* Sidebar Content */}
            <div className={`h-full flex flex-col transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Header */}
                <div className="p-3 sm:p-4 border-b border-sand-300 bg-gradient-to-r from-forest-500 to-forest-600">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base sm:text-lg font-bold text-sand-50 flex items-center gap-2">
                            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                            Properties
                        </h2>
                        <span className="bg-sand-50/20 text-sand-50 text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                            {properties.length}
                        </span>
                    </div>
                    <p className="text-xs text-sand-200 mt-1">Click to view details</p>
                </div>

                {/* Property List */}
                <div className="flex-1 overflow-y-auto">
                    {properties.length === 0 ? (
                        <div className="p-6 sm:p-8 text-center text-sand-700">
                            <MapPin className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-sand-500" />
                            <p className="font-medium text-sm sm:text-base">No properties found</p>
                            <p className="text-xs sm:text-sm mt-1">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-sand-200">
                            {properties.map((property) => {
                                const isSelected = selectedProperty?.property_id === property.property_id;

                                const pricePerSqft = Math.round(property.actual_fair_value / property.plot_size_sqft);

                                return (
                                    <button
                                        key={property.property_id}
                                        onClick={() => onPropertySelect(property)}
                                        className={`w-full text-left p-3 sm:p-4 hover:bg-sand-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-inset ${isSelected ? 'bg-forest-50 border-l-4 border-forest-600' : ''
                                            }`}
                                        aria-label={`Select property in ${property.area_name}`}
                                    >
                                        <div className="flex items-start justify-between gap-2 sm:gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`font-semibold text-xs sm:text-sm truncate ${isSelected ? 'text-forest-800' : 'text-charcoal-500'
                                                    }`}>
                                                    {property.area_name}
                                                </h3>
                                                <p className="text-xs text-sand-700 mt-0.5">
                                                    Property #{property.property_id}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <div className="flex-shrink-0">
                                                    <div className="w-2 h-2 bg-forest-600 rounded-full animate-pulse shadow-lg shadow-forest-500/50"></div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-2 sm:mt-3 space-y-2">
                                            {/* Price */}
                                            <div className="flex items-baseline justify-between">
                                                <span className={`text-base sm:text-lg font-bold ${isSelected ? 'text-forest-700' : 'text-charcoal-500'}`}>
                                                    {formatPrice(property.actual_fair_value)}
                                                </span>
                                                <span className="text-xs text-sand-700 bg-sand-200 px-2 py-0.5 rounded-full">
                                                    ₹{pricePerSqft}/sq ft
                                                </span>
                                            </div>

                                            {/* Property Details */}
                                            <div className="flex items-center gap-2 sm:gap-3 text-xs text-sand-700">
                                                <span className="flex items-center gap-1">
                                                    <Home className="w-3 h-3" />
                                                    {property.bhk} BHK
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Maximize2 className="w-3 h-3" />
                                                    {property.plot_size_sqft} sq ft
                                                </span>
                                            </div>

                                            {/* Zone Tag */}
                                            <div className="flex items-center gap-2">
                                                <span className="inline-block text-xs bg-sand-200 text-sand-800 px-2 py-0.5 rounded-full capitalize">
                                                    {property.zone_type}
                                                </span>
                                                <span className="text-xs text-sand-600">
                                                    {property.property_age_years} years old
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PropertyList;

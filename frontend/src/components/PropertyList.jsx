import React from 'react';
import { ChevronLeft, ChevronRight, MapPin, Home, Maximize2 } from 'lucide-react';

function PropertyList({ properties, selectedProperty, onPropertySelect, isOpen, onToggle }) {
    return (
        <div className={`relative h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ${isOpen ? 'w-80' : 'w-0'}`}>
            {/* Toggle Button - Centered */}
            <button
                onClick={onToggle}
                className="absolute -right-10 top-1/2 -translate-y-1/2 z-[1100] bg-white border border-gray-300 rounded-r-lg px-2 py-3 hover:bg-gray-50 transition-colors shadow-md"
                aria-label={isOpen ? 'Close property list' : 'Open property list'}
                aria-expanded={isOpen}
            >
                {isOpen ? (
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                )}
            </button>

            {/* Sidebar Content */}
            <div className={`h-full flex flex-col transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-forest-500 to-forest-600">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Home className="w-5 h-5" />
                            Properties
                        </h2>
                        <span className="bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            {properties.length}
                        </span>
                    </div>
                    <p className="text-xs text-sand-200 mt-1">Click to view details</p>
                </div>

                {/* Property List */}
                <div className="flex-1 overflow-y-auto">
                    {properties.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="font-medium">No properties found</p>
                            <p className="text-sm mt-1">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {properties.map((property) => {
                                const isSelected = selectedProperty?.property_id === property.property_id;
                                const priceInLakhs = (property.actual_fair_value / 100000).toFixed(2);
                                const pricePerSqft = Math.round(property.actual_fair_value / property.plot_size_sqft);

                                return (
                                    <button
                                        key={property.property_id}
                                        onClick={() => onPropertySelect(property)}
                                        className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-forest-50 border-l-4 border-forest-600' : ''
                                            }`}
                                        aria-label={`Select property in ${property.area_name}`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`font-semibold text-sm truncate ${isSelected ? 'text-forest-800' : 'text-gray-800'
                                                    }`}>
                                                    {property.area_name}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Property #{property.property_id}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <div className="flex-shrink-0">
                                                    <div className="w-2 h-2 bg-forest-600 rounded-full animate-pulse"></div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-3 space-y-2">
                                            {/* Price */}
                                            <div className="flex items-baseline justify-between">
                                                <span className={`text-lg font-bold ${isSelected ? 'text-forest-700' : 'text-gray-900'
                                                    }`}>
                                                    ₹{priceInLakhs}L
                                                </span>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                    ₹{pricePerSqft}/sq ft
                                                </span>
                                            </div>

                                            {/* Property Details */}
                                            <div className="flex items-center gap-3 text-xs text-gray-600">
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
                                                <span className="inline-block text-xs bg-sand-100 text-sand-700 px-2 py-0.5 rounded capitalize">
                                                    {property.zone_type}
                                                </span>
                                                <span className="text-xs text-gray-500">
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

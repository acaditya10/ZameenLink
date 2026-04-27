import React, { useState, useEffect } from 'react';
import { formatPrice } from '../utils/formatters';
import { X, CheckCircle, TrendingUp, Bookmark } from 'lucide-react';
import { predictPrice } from '../api/apiClient';
import { useAuth } from '../contexts/AuthContext';
import { saveProperty, removeSavedProperty, getSavedProperties, savePredictionHistory } from '../services/firestoreService';
import ScamAlert from './ScamAlert';
import ComparisonTable from './ComparisonTable';
import EMICalculator from './EMICalculator';
import PriceTrendChart from './PriceTrendChart';

function PredictionPanel({ property, prediction, onClose, onPredict }) {
    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [savingBookmark, setSavingBookmark] = useState(false);
    const { user, incrementPredictionCount } = useAuth();

    // Reset local state when property changes
    useEffect(() => {
        if (property && !prediction) {
            fetchPrediction();
        }
        // Check if property is saved
        if (user && property) {
            checkIfSaved();
        } else {
            setIsSaved(false);
        }
    }, [property]);

    const checkIfSaved = async () => {
        try {
            const saved = await getSavedProperties(user.uid);
            setIsSaved(saved.some(p => String(p.property_id) === String(property.property_id)));
        } catch (error) {
            console.error('Failed to check saved status:', error);
        }
    };

    const fetchPrediction = async () => {
        setLoading(true);
        try {
            const result = await predictPrice(property);
            onPredict(result);
            incrementPredictionCount();

            // Save to prediction history if logged in
            if (user) {
                try {
                    // Fire and forget so we don't block the UI if Firestore hangs
                    savePredictionHistory(user.uid, property, result).catch(err => {
                        console.error('Failed to save prediction history:', err);
                    });
                } catch (err) {
                    console.error('Failed to save prediction history:', err);
                }
            }
        } catch (error) {
            console.error('Prediction failed:', error);
        }
        setLoading(false);
    };

    const toggleSave = async () => {
        if (!user) return;
        const newSavedState = !isSaved;
        setIsSaved(newSavedState); // optimistic update
        try {
            if (!newSavedState) {
                removeSavedProperty(user.uid, property.property_id).catch(err => {
                    console.error('Failed to remove save:', err);
                    setIsSaved(true); // revert
                });
            } else {
                saveProperty(user.uid, property).catch(err => {
                    console.error('Failed to toggle save:', err);
                    setIsSaved(false); // revert
                });
            }
        } catch (error) {
            console.error('Failed to process toggle save:', error);
            setIsSaved(!newSavedState);
        }
    };

    if (!property) return null;

    return (
        <div className="absolute right-0 top-0 h-full w-full md:w-96 bg-sand-50 shadow-2xl overflow-y-auto z-[1100] border-l border-sand-300 transition-transform duration-300 ease-in-out">
            {/* Backdrop for mobile */}
            <div
                className="fixed inset-0 bg-charcoal-500/30 backdrop-blur-sm md:hidden -z-10"
                onClick={onClose}
                aria-hidden="true"
            ></div>
            {/* Header */}
            <div className="sticky top-0 bg-forest-500 text-sand-50 p-4 flex justify-between items-center z-20 border-b border-gold-500/30 shadow-md">
                <div className="flex-1 min-w-0 mr-3">
                    <h2 className="text-xl font-bold truncate" title={property.area_name}>
                        {property.area_name}
                    </h2>
                    <p className="text-sm text-gold-400">Property #{property.property_id}</p>
                </div>
                <div className="flex items-center gap-2">
                    {user && (
                        <button
                            onClick={toggleSave}
                            disabled={savingBookmark}
                            className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-500 ${isSaved ? 'bg-gold-500/20 text-gold-400' : 'hover:bg-sand-50/20 text-sand-100 hover:text-sand-50'}`}
                            aria-label={isSaved ? 'Remove from saved' : 'Save property'}
                        >
                            {isSaved ? <Bookmark size={22} fill="currentColor" /> : <Bookmark size={22} />}
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="hover:bg-sand-50/20 p-2 rounded-lg transition-all duration-200 text-sand-100 hover:text-sand-50 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-gold-500"
                        aria-label="Close property details"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Property Details */}
            <div className="p-4 border-b border-sand-300 bg-sand-100/50">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-sand-700 uppercase tracking-wide font-semibold">Plot Size</p>
                        <p className="text-lg font-semibold text-forest-700">{property.plot_size_sqft} sq ft</p>
                    </div>
                    <div>
                        <p className="text-xs text-sand-700 uppercase tracking-wide font-semibold">Bedrooms</p>
                        <p className="text-lg font-semibold text-forest-700">{property.bhk} BHK</p>
                    </div>
                    <div>
                        <p className="text-xs text-sand-700 uppercase tracking-wide font-semibold">Age</p>
                        <p className="text-lg font-semibold text-forest-700">{property.property_age_years} years</p>
                    </div>
                    <div>
                        <p className="text-xs text-sand-700 uppercase tracking-wide font-semibold">Zone</p>
                        <p className="text-lg font-semibold text-forest-700 capitalize">{property.zone_type}</p>
                    </div>

                    {/* Dynamic Amenities & Description */}
                    {(property.description_text || (property.amenities && property.amenities.length > 0)) && (
                        <div className="col-span-2 mt-2 pt-4 border-t border-sand-300 space-y-4">
                            {property.description_text && (
                                <div>
                                    <p className="text-xs text-sand-700 uppercase tracking-wide mb-1.5 font-bold">About Property</p>
                                    <p className="text-sm text-charcoal-500 leading-relaxed">{property.description_text}</p>
                                </div>
                            )}

                            {property.amenities && property.amenities.length > 0 && (
                                <div>
                                    <p className="text-xs text-sand-700 uppercase tracking-wide mb-2 font-bold">Unique Features & Amenities</p>
                                    <div className="flex flex-wrap gap-2">
                                        {property.amenities.map((amenity, idx) => (
                                            <span key={idx} className="text-[11px] font-medium bg-forest-50 text-forest-800 px-2 py-1 rounded-full border border-forest-200 shadow-sm">
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Prediction Results */}
            {loading ? (
                <div className="p-12 text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-forest-200 border-t-forest-600 mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-6 h-6 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-4 text-forest-800 font-medium">Analyzing property valuation...</p>
                </div>
            ) : prediction ? (
                <div className="p-4 space-y-4">
                    {/* Price Prediction Card */}
                    <div className="bg-gradient-to-br from-sand-200 to-sand-50 p-5 rounded-xl border border-gold-400/30 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gold-400/10 rounded-bl-full -mr-4 -mt-4"></div>
                        <p className="text-sm text-forest-800 font-medium mb-1 relative z-10">ML Predicted Fair Value</p>
                        <p className="text-3xl font-bold text-forest-600 relative z-10">
                            {formatPrice(prediction.predicted_fair_value)}
                        </p>
                        <p className="text-sm text-sand-700 mt-2 flex items-center gap-1 relative z-10">
                            <span className="bg-sand-50 px-2 py-0.5 rounded-full text-xs border border-sand-300 font-mono text-forest-700">
                                ₹{prediction.price_per_sqft.toFixed(0)}/sq ft
                            </span>
                            <span>estimated market rate</span>
                        </p>
                    </div>

                    {/* Scam Alert */}
                    {prediction.scam_analysis && (
                        <ScamAlert analysis={prediction.scam_analysis} />
                    )}

                    {/* Model Confidence */}
                    <div className="bg-forest-50 p-4 rounded-xl border border-forest-200">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle size={20} className="text-forest-600" />
                            <span className="font-semibold text-forest-800">High Confidence Prediction</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-sand-50 p-2 rounded-lg border border-forest-100">
                                <span className="text-forest-600 block text-xs">Accuracy (R²)</span>
                                <span className="font-semibold text-forest-800">{(prediction.model_confidence.r2_score * 100).toFixed(1)}%</span>
                            </div>
                            <div className="bg-sand-50 p-2 rounded-lg border border-forest-100">
                                <span className="text-forest-600 block text-xs">Margin of Error</span>
                                <span className="font-semibold text-forest-800">±{formatPrice(prediction.model_confidence.avg_error)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Nearby Comparisons */}
                    {prediction.nearby_properties && prediction.nearby_properties.length > 0 && (
                        <div className="pt-2">
                            <h3 className="font-semibold text-forest-800 mb-2 flex items-center gap-2 px-1">
                                <TrendingUp size={18} className="text-gold-600" />
                                Comparable Properties
                            </h3>
                            <ComparisonTable properties={prediction.nearby_properties} />
                        </div>
                    )}

                    {/* EMI Calculator */}
                    <EMICalculator propertyPrice={prediction.predicted_fair_value} />

                    {/* Price Trend Chart */}
                    <PriceTrendChart areaName={property.area_name} />
                </div>
            ) : (
                <div className="p-8 text-center text-sand-700">
                    <p>Select a property or click Check to see valuation.</p>
                </div>
            )}
        </div>
    );
}

export default PredictionPanel;

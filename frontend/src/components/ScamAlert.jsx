import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Star, Shield, Image as ImageIcon, FileText, IndianRupee, ChevronDown, ChevronUp } from 'lucide-react';

function ScamAlert({ analysis }) {
    const [expanded, setExpanded] = useState(false);

    if (!analysis) return null;

    const isEnhanced = !!analysis.breakdown;

    const getIcon = (level) => {
        switch (level) {
            case 'CRITICAL': return <AlertTriangle size={24} />;
            case 'HIGH': return <AlertTriangle size={24} />;
            case 'MEDIUM': return <AlertCircle size={24} />;
            case 'LOW': return <CheckCircle size={24} />;
            case 'SAFE': return <Shield size={24} />;
            case 'BARGAIN': return <Star size={24} />;
            default: return <AlertCircle size={24} />;
        }
    };

    return (
        <div
            className="rounded-lg overflow-hidden border transition-all duration-300"
            style={{
                backgroundColor: `${analysis.color}08`,
                borderColor: `${analysis.color}40`,
                boxShadow: analysis.is_scam ? `0 4px 12px ${analysis.color}20` : 'none'
            }}
        >
            {/* Header */}
            <div 
                className={`p-4 flex items-start gap-3 ${isEnhanced ? 'cursor-pointer' : ''}`}
                onClick={() => isEnhanced && setExpanded(!expanded)}
            >
                <div style={{ color: analysis.color }} className="mt-0.5">
                    {getIcon(analysis.risk_level)}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold tracking-wide" style={{ color: analysis.color }}>
                                {analysis.risk_level} RISK
                            </p>
                            <p className="text-sm font-medium text-gray-800 mt-1">{analysis.message}</p>
                        </div>
                        {isEnhanced && (
                            <button className="text-gray-500 hover:text-gray-800 p-1">
                                {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Basic View (Backward Compatibility) */}
            {!isEnhanced && (
                <div className="px-4 pb-4 pt-1 ml-10">
                    <p className="text-xs text-gray-500">
                        Price deviation: <span className="font-semibold text-gray-700">{analysis.deviation_percent}%</span> from market average
                    </p>
                </div>
            )}

            {/* Enhanced View Breakdown */}
            {isEnhanced && expanded && (
                <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: `${analysis.color}20`, backgroundColor: 'rgba(255,255,255,0.5)' }}>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 ml-1">Risk Signal Breakdown</p>
                    
                    <div className="space-y-3">
                        {/* Price Analysis */}
                        <div className="flex gap-3 items-start bg-white p-2.5 rounded shadow-sm border border-gray-100">
                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded">
                                <IndianRupee size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-sm font-semibold text-gray-800">Price Deviation Valuation</p>
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">Weight: 50%</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-1">{analysis.breakdown.price_analysis.message}</p>
                                <p className="text-[10px] text-gray-500">Deviation: <span className="font-medium text-gray-700">{analysis.breakdown.price_analysis.deviation_percent}%</span></p>
                            </div>
                        </div>

                        {/* Text Analysis */}
                        <div className="flex gap-3 items-start bg-white p-2.5 rounded shadow-sm border border-gray-100">
                            <div className="p-1.5 bg-purple-50 text-purple-600 rounded">
                                <FileText size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-sm font-semibold text-gray-800">NLP Listing Description</p>
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">Weight: 30%</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-1">{analysis.breakdown.text_analysis.summary}</p>
                                
                                {analysis.breakdown.text_analysis.flagged_phrases?.length > 0 && (
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {analysis.breakdown.text_analysis.flagged_phrases.map((phrase, i) => (
                                            <span key={i} className="text-[9px] px-1.5 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded">Alert: "{phrase}"</span>
                                        ))}
                                    </div>
                                )}
                                {analysis.breakdown.text_analysis.positive_signals?.length > 0 && (
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {analysis.breakdown.text_analysis.positive_signals.map((signal, i) => (
                                            <span key={i} className="text-[9px] px-1.5 py-0.5 bg-green-50 text-green-600 border border-green-100 rounded">Verified: "{signal}"</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Image Analysis */}
                        <div className="flex gap-3 items-start bg-white p-2.5 rounded shadow-sm border border-gray-100">
                            <div className="p-1.5 bg-amber-50 text-amber-600 rounded">
                                <ImageIcon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-sm font-semibold text-gray-800">Gallery Analysis</p>
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">Weight: 20%</span>
                                </div>
                                <p className="text-[10px] text-gray-500 mb-1">Total Images: <span className="font-medium text-gray-700">{analysis.breakdown.image_analysis.images_analyzed}</span></p>
                                
                                {analysis.breakdown.image_analysis.flags?.length > 0 ? (
                                    <ul className="text-xs text-amber-700 list-disc list-inside space-y-0.5 ml-1">
                                        {analysis.breakdown.image_analysis.flags.map((flag, i) => <li key={i}>{flag}</li>)}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-green-600">✓ Passes image quantity checks</p>
                                )}
                            </div>
                        </div>

                        {/* Composite Score */}
                        <div className="pt-2 flex justify-between items-center border-t border-gray-100 mt-2">
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Composite AI Score</span>
                            <span className="text-sm font-bold" style={{ color: analysis.color }}>
                                {analysis.composite_score} / 100
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ScamAlert;

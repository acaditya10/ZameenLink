import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Star } from 'lucide-react';

function ScamAlert({ analysis }) {
    if (!analysis) return null;

    const getIcon = () => {
        switch (analysis.risk_level) {
            case 'CRITICAL': return <AlertTriangle size={24} />;
            case 'HIGH': return <AlertCircle size={24} />;
            case 'MEDIUM': return <AlertCircle size={20} />;
            case 'LOW': return <CheckCircle size={20} />;
            case 'BARGAIN': return <Star size={20} />;
            default: return null;
        }
    };

    return (
        <div
            className="p-4 rounded-lg border-2"
            style={{
                backgroundColor: `${analysis.color}15`,
                borderColor: analysis.color
            }}
        >
            <div className="flex items-start gap-3">
                <div style={{ color: analysis.color }}>
                    {getIcon()}
                </div>
                <div className="flex-1">
                    <p className="font-semibold" style={{ color: analysis.color }}>
                        {analysis.risk_level} RISK
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{analysis.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                        Price deviation: <span className="font-semibold">{analysis.deviation_percent}%</span> from market average
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ScamAlert;

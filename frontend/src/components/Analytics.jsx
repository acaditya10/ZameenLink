import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronUp, ChevronDown, BarChart3 } from 'lucide-react';

function Analytics({ metrics }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!metrics) return null;

    // Transform metrics object for Recharts
    const chartData = Object.entries(metrics).map(([name, values]) => ({
        name: name,
        'R² Score': (values.r2_score * 100).toFixed(1),
        'RMSE (₹L)': (values.rmse / 100000).toFixed(1),
        'MAE (₹L)': (values.mae / 100000).toFixed(1)
    }));

    return (
        <div className="bg-sand-50 border-t border-forest-500/20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 relative">
            <div className="container mx-auto px-4">
                {/* Header - Always Visible */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between py-3 hover:bg-sand-100/50 rounded-lg transition-colors group"
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? 'Collapse model performance comparison' : 'Expand model performance comparison'}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center group-hover:bg-forest-200 transition-colors">
                            <BarChart3 className="w-5 h-5 text-forest-700" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-bold text-forest-800 flex items-center gap-2">
                                Model Performance Comparison
                            </h3>
                            <span className="text-xs text-charcoal-light">
                                {isExpanded ? 'Click to collapse' : 'Click to expand - Compare 3 ML models'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isExpanded && (
                            <span className="text-xs text-charcoal-light bg-sand-200 px-2 py-1 rounded hidden md:block">
                                Lower error (RMSE/MAE) = Better accuracy
                            </span>
                        )}
                        <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center group-hover:bg-forest-200 transition-colors">
                            {isExpanded ? (
                                <ChevronDown className="w-5 h-5 text-forest-700" />
                            ) : (
                                <ChevronUp className="w-5 h-5 text-forest-700" />
                            )}
                        </div>
                    </div>
                </button>

                {/* Collapsible Content */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[250px] opacity-100 mb-3' : 'max-h-0 opacity-0 mb-0'
                        }`}
                    aria-hidden={!isExpanded}
                >
                    <div className="pt-2 pb-3">
                        {/* Info Badge */}
                        <div className="flex items-center justify-end mb-3">
                            <span className="text-xs text-charcoal-light bg-sand-200 px-3 py-1.5 rounded-full">
                                📊 Lower error (RMSE/MAE) = Better accuracy
                            </span>
                        </div>

                        {/* Chart */}
                        <div className="h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5DFCE" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 12, fill: '#544F44' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#7D7766' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#FFFEFC',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            border: '1px solid #E5DFCE'
                                        }}
                                        cursor={{ fill: '#F9F7F2' }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
                                    <Bar dataKey="R² Score" name="R² Score (%)" fill="#2C4F38" radius={[4, 4, 0, 0]} maxBarSize={60} />
                                    <Bar dataKey="RMSE (₹L)" name="RMSE (Lakhs)" fill="#D4A373" radius={[4, 4, 0, 0]} maxBarSize={60} />
                                    <Bar dataKey="MAE (₹L)" name="MAE (Lakhs)" fill="#A79F88" radius={[4, 4, 0, 0]} maxBarSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;

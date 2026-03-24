import React, { useState, useEffect } from 'react';
import { fetchTrends } from '../api/apiClient';
import { formatPrice } from '../utils/formatters';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Info } from 'lucide-react';

function PriceTrendChart({ areaName }) {
    const [trendData, setTrendData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (areaName) {
            loadTrends();
        }
    }, [areaName]);

    const loadTrends = async () => {
        setLoading(true);
        try {
            const data = await fetchTrends(areaName);
            setTrendData(data);
        } catch (error) {
            console.error('Failed to load trends:', error);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-forest-200 p-4 mt-4 text-center h-[200px] flex items-center justify-center">
                <div className="animate-spin h-6 w-6 border-2 border-forest-600 rounded-full border-t-transparent"></div>
            </div>
        );
    }
    
    if (!trendData || !trendData.history) return null;

    const isPositive = trendData.growth_2yr >= 0;

    return (
        <div className="bg-white rounded-xl border border-forest-200 overflow-hidden shadow-sm mt-4">
            <div className="bg-forest-50 px-4 py-3 border-b border-forest-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-forest-600" />
                    <h3 className="font-semibold text-forest-800 text-sm">Historical Price Trends</h3>
                </div>
                <div className={`text-xs font-semibold px-2 py-0.5 rounded ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isPositive ? '+' : ''}{trendData.growth_2yr}% (2Y)
                </div>
            </div>
            
            <div className="p-4">
                <p className="text-xs text-charcoal-light mb-3">
                    Average price per sqft for <span className="font-semibold text-forest-700">{areaName}</span> over the last 8 quarters.
                </p>
                
                <div className="h-[160px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData.history} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5DFCE" />
                            <XAxis 
                                dataKey="quarter" 
                                tick={{ fontSize: 10, fill: '#7D7766' }} 
                                axisLine={false} tickLine={false} 
                                dy={5}
                            />
                            <YAxis 
                                domain={['dataMin - 500', 'auto']}
                                tick={{ fontSize: 10, fill: '#7D7766' }} 
                                axisLine={false} tickLine={false}
                                width={45}
                                tickFormatter={(val) => `₹${val/1000}k`}
                            />
                            <Tooltip 
                                formatter={(value) => [formatPrice(value), 'Price/sqft']}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #D4A373', fontSize: '12px' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="price_per_sqft" 
                                stroke="#D4A373" 
                                strokeWidth={3}
                                dot={{ fill: '#2C4F38', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, fill: '#D4A373', stroke: '#fff' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default PriceTrendChart;

import React, { useState, useEffect } from 'react';
import { calculateEMI } from '../api/apiClient';
import { formatPrice } from '../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown, ChevronUp, Calculator } from 'lucide-react';

function EMICalculator({ propertyPrice }) {
    const [principal, setPrincipal] = useState(propertyPrice || 5000000);
    const [rate, setRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);
    const [downPayment, setDownPayment] = useState(20);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);

    useEffect(() => {
        if (propertyPrice) {
            setPrincipal(propertyPrice);
        }
    }, [propertyPrice]);

    // Use a debounce for the API call to avoid spamming the backend
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEMI();
        }, 300);
        return () => clearTimeout(timer);
    }, [principal, rate, tenure, downPayment]);

    const fetchEMI = async () => {
        setLoading(true);
        try {
            const data = await calculateEMI({
                principal,
                annual_rate: rate,
                tenure_years: tenure,
                down_payment_percent: downPayment
            });
            setResult(data);
        } catch (error) {
            console.error('EMI calculation failed:', error);
        }
        setLoading(false);
    };

    if (!result) return null;

    const chartData = [
        { name: 'Principal Loan', value: result.loan_amount },
        { name: 'Total Interest', value: result.total_interest }
    ];
    const COLORS = ['#2C4F38', '#D4A373'];

    return (
        <div className="bg-white rounded-xl border border-forest-200 overflow-hidden shadow-sm mt-4">
            <div className="bg-forest-50 px-4 py-3 border-b border-forest-100 flex items-center gap-2">
                <Calculator size={18} className="text-forest-600" />
                <h3 className="font-semibold text-forest-800">EMI Calculator</h3>
            </div>
            
            <div className="p-4 space-y-4">
                {/* Inputs */}
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-charcoal-light font-medium">Down Payment ({downPayment}%)</span>
                            <span className="text-forest-700 font-semibold">{formatPrice(principal * (downPayment/100))}</span>
                        </div>
                        <input 
                            type="range" min="0" max="80" step="5"
                            value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))}
                            className="w-full accent-forest-600"
                        />
                    </div>
                    
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-charcoal-light font-medium">Interest Rate</span>
                            <span className="text-forest-700 font-semibold">{rate}%</span>
                        </div>
                        <input 
                            type="range" min="6.5" max="15" step="0.1"
                            value={rate} onChange={(e) => setRate(Number(e.target.value))}
                            className="w-full accent-forest-600"
                        />
                    </div>
                    
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-charcoal-light font-medium">Tenure (Years)</span>
                            <span className="text-forest-700 font-semibold">{tenure} Yrs</span>
                        </div>
                        <input 
                            type="range" min="5" max="30" step="1"
                            value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full accent-forest-600"
                        />
                    </div>
                </div>

                {/* Results UI */}
                <div className="flex items-center pt-2 border-t border-forest-100/50">
                    <div className="flex-1">
                        <p className="text-xs text-charcoal-light mb-1 uppercase tracking-wider">Monthly EMI</p>
                        <p className="text-2xl font-bold text-forest-700">{formatPrice(result.monthly_emi)}</p>
                    </div>
                    
                    <div className="w-24 h-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData} innerRadius={25} outerRadius={40}
                                    paddingAngle={2} dataKey="value" stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(val) => formatPrice(val)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-forest-50 p-2 rounded flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-forest-800"></div>
                        <span className="text-charcoal-light flex-1">Loan</span>
                        <span className="font-semibold text-forest-800">{formatPrice(result.loan_amount)}</span>
                    </div>
                    <div className="bg-gold-50 p-2 rounded flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-gold-400"></div>
                        <span className="text-charcoal-light flex-1">Interest</span>
                        <span className="font-semibold text-forest-800">{formatPrice(result.total_interest)}</span>
                    </div>
                </div>

                {/* Optional Schedule */}
                <button 
                    onClick={() => setShowSchedule(!showSchedule)}
                    className="w-full flex items-center justify-center gap-1 text-xs text-forest-600 font-semibold pt-2"
                >
                    {showSchedule ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    {showSchedule ? 'Hide Schedule' : 'View First Year Schedule'}
                </button>
                
                {showSchedule && result.amortization_schedule && (
                    <div className="overflow-x-auto mt-2">
                        <table className="w-full text-xs text-left text-gray-500">
                            <thead className="text-[10px] text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-2 py-1.5">Mo</th>
                                    <th className="px-2 py-1.5">Principal</th>
                                    <th className="px-2 py-1.5">Interest</th>
                                    <th className="px-2 py-1.5">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.amortization_schedule.map((row) => (
                                    <tr key={row.month} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-2 py-1.5">{row.month}</td>
                                        <td className="px-2 py-1.5">{formatPrice(row.principal)}</td>
                                        <td className="px-2 py-1.5">{formatPrice(row.interest)}</td>
                                        <td className="px-2 py-1.5 font-medium">{formatPrice(row.balance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EMICalculator;

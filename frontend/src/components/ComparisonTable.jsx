import React from 'react';
import { formatPrice } from '../utils/formatters';

function ComparisonTable({ properties }) {
    if (!properties || properties.length === 0) return null;

    return (
        <div className="overflow-hidden rounded-xl border border-sand-300 mt-4 shadow-sm">
            <table className="min-w-full divide-y divide-sand-200 text-sm">
                <thead className="bg-sand-100">
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Area</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Size</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Price</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Dist</th>
                    </tr>
                </thead>
                <tbody className="bg-sand-50 divide-y divide-sand-200">
                    {properties.map((prop, idx) => (
                        <tr key={idx} className="hover:bg-sand-100 transition-colors">
                            <td className="px-3 py-2 whitespace-nowrap text-charcoal-500 truncate max-w-[100px]" title={prop.area_name}>
                                {prop.area_name}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sand-700">{prop.plot_size_sqft} sqft</td>
                            <td className="px-3 py-2 whitespace-nowrap text-forest-600 font-semibold">
                                {formatPrice(prop.actual_fair_value)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sand-600 text-xs">
                                {prop.distance_from_query.toFixed(2)} km
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ComparisonTable;

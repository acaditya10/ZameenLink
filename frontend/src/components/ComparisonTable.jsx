import React from 'react';
import { formatPrice } from '../utils/formatters';

function ComparisonTable({ properties }) {
    if (!properties || properties.length === 0) return null;

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 mt-4">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Area</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dist</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {properties.map((prop, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap text-gray-900 truncate max-w-[100px]" title={prop.area_name}>
                                {prop.area_name}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-gray-600">{prop.plot_size_sqft} sqft</td>
                            <td className="px-3 py-2 whitespace-nowrap text-indigo-600 font-semibold">
                                {formatPrice(prop.actual_fair_value)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-gray-500 text-xs">
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

export const formatPrice = (price) => {
    if (!price && price !== 0) return '₹0';

    // Convert to number if string
    const value = Number(price);

    // Check for invalid values
    if (isNaN(value)) return '₹0';

    if (value >= 10000000) {
        // Crores (e.g. 1.25 Cr)
        return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
        // Lakhs (e.g. 85.5 L)
        return `₹${(value / 100000).toFixed(2)} L`;
    } else if (value >= 1000) {
        // Thousands (e.g. 25 K)
        return `₹${(value / 1000).toFixed(1)} K`;
    } else {
        // Raw value
        return `₹${value.toLocaleString('en-IN')}`;
    }
};

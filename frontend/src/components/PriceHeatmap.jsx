import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

function PriceHeatmap({ properties }) {
    const map = useMap();

    useEffect(() => {
        if (!properties || properties.length === 0) return;

        // Prepare heatmap data: [lat, lng, intensity]
        // Intensity is normalized price per sqft
        const heatData = properties.map(prop => {
            const pricePerSqft = prop.actual_fair_value / prop.plot_size_sqft;
            // Normalize price to 0-1 scale for heatmap intensity (assuming max ~10000)
            const intensity = Math.min(pricePerSqft / 10000, 1);
            return [prop.latitude, prop.longitude, intensity];
        });

        // Create heatmap layer
        const heatLayer = L.heatLayer(heatData, {
            radius: 25,
            blur: 35,
            maxZoom: 17,
            max: 1.0,
            gradient: {
                0.0: 'green',
                0.5: 'yellow',
                0.7: 'orange',
                1.0: 'red'
            }
        }).addTo(map);

        // Cleanup
        return () => {
            if (map && heatLayer) {
                map.removeLayer(heatLayer);
            }
        };
    }, [properties, map]);

    return null;
}

export default PriceHeatmap;

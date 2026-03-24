import React, { useEffect, useRef } from 'react';
import { formatPrice } from '../utils/formatters';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PriceHeatmap from './PriceHeatmap';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const BHOPAL_CENTER = [23.2599, 77.4126];
const BHOPAL_BOUNDS = [
    [23.00, 77.20], // South-West
    [23.50, 77.65]  // North-East
];

// Custom marker icons based on price range
const createCustomIcon = (pricePerSqft, isSelected = false) => {
    let color = '#10B981'; // Green (cheap)
    if (pricePerSqft > 7000) color = '#DC2626'; // Red (expensive)
    else if (pricePerSqft > 5000) color = '#F59E0B'; // Yellow (moderate)

    const size = isSelected ? 32 : 24;
    const borderWidth = isSelected ? 4 : 3;

    return L.divIcon({
        className: 'custom-marker',
        html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: ${borderWidth}px solid white;
        box-shadow: 0 ${isSelected ? 4 : 2}px ${isSelected ? 12 : 8}px rgba(0,0,0,${isSelected ? 0.4 : 0.3});
        cursor: pointer;
        transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'};
        transition: all 0.3s ease;
      "></div>
    `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });
};

// Component to control map programmatically
function MapController({ selectedProperty, markerRefs }) {
    const map = useMap();

    useEffect(() => {
        if (!selectedProperty) return;

        const tryOpenPopup = (retries = 0) => {
            const marker = markerRefs.current[selectedProperty.property_id];
            if (marker) {
                marker.openPopup();
            } else if (retries < 5) {
                // Marker may not be visible yet (inside a cluster) — retry
                setTimeout(() => tryOpenPopup(retries + 1), 400);
            }
        };

        // Fly to the selected property
        map.flyTo(
            [selectedProperty.latitude, selectedProperty.longitude],
            17, // Higher zoom to break clusters apart
            {
                duration: 1.2,
                easeLinearity: 0.25
            }
        );

        // After the flyTo animation finishes, try to open the popup
        const onMoveEnd = () => {
            map.off('moveend', onMoveEnd);
            setTimeout(() => tryOpenPopup(), 300);
        };
        map.on('moveend', onMoveEnd);

        return () => {
            map.off('moveend', onMoveEnd);
        };
    }, [selectedProperty, map, markerRefs]);

    return null;
}

function MapView({ properties, onPropertyClick, selectedProperty, showHeatmap, mapLayer = 'osm' }) {
    const markerRefs = useRef({});

    return (
        <MapContainer
            center={BHOPAL_CENTER}
            zoom={12}
            className="w-full h-full"
            zoomControl={false}
            style={{ height: '100%', width: '100%' }}
            maxBounds={BHOPAL_BOUNDS}
            maxBoundsViscosity={1.0}
            minZoom={11}
        >
            {mapLayer === 'satellite' ? (
                <TileLayer
                    url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                    attribution="&copy; Google Maps"
                    maxZoom={20}
                />
            ) : (
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            )}

            {/* Map Controller for auto-focus */}
            <MapController selectedProperty={selectedProperty} markerRefs={markerRefs} />

            {/* Zoom Controls - Positioned Bottom Right */}
            <ZoomControl position="bottomright" />

            {/* Heatmap Layer */}
            {showHeatmap && <PriceHeatmap properties={properties} />}

            {/* Property Markers with Clustering */}
            <MarkerClusterGroup
                chunkedLoading
                spiderfyOnMaxZoom={true}
                showCoverageOnHover={false}
                zoomToBoundsOnClick={true}
                maxClusterRadius={60}
                iconCreateFunction={(cluster) => {
                    const count = cluster.getChildCount();
                    let size = 'small';
                    let sizeClass = '';

                    if (count >= 100) {
                        size = 'large';
                        sizeClass = 'w-14 h-14 text-base';
                    } else if (count >= 50) {
                        size = 'medium';
                        sizeClass = 'w-12 h-12 text-sm';
                    } else {
                        sizeClass = 'w-10 h-10 text-xs';
                    }

                    return L.divIcon({
                        html: `<div class="flex items-center justify-center ${sizeClass} bg-forest-500 text-white rounded-full border-4 border-white shadow-lg font-bold">${count}</div>`,
                        className: 'custom-cluster-icon',
                        iconSize: L.point(40, 40, true)
                    });
                }}
            >
                {properties.map((property) => {
                    const pricePerSqft = property.actual_fair_value / property.plot_size_sqft;
                    const isSelected = selectedProperty?.property_id === property.property_id;

                    return (
                        <Marker
                            key={property.property_id}
                            position={[property.latitude, property.longitude]}
                            icon={createCustomIcon(pricePerSqft, isSelected)}
                            eventHandlers={{
                                click: () => onPropertyClick(property)
                            }}
                            ref={(ref) => {
                                if (ref) {
                                    markerRefs.current[property.property_id] = ref;
                                }
                            }}
                        >
                            <Popup>
                                <div className="p-2 min-w-[200px]">
                                    <h3 className="font-bold text-lg text-gray-800">{property.area_name}</h3>
                                    <p className="text-sm text-gray-600">{property.bhk} BHK • {property.plot_size_sqft} sq ft</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-lg font-semibold text-forest-600">
                                            {formatPrice(property.actual_fair_value)}
                                        </p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${pricePerSqft > 7000 ? 'bg-red-100 text-red-800' :
                                            pricePerSqft > 5000 ? 'bg-gold-400/20 text-gold-600' :
                                                'bg-forest-100 text-forest-800'
                                            }`}>
                                            ₹{pricePerSqft.toFixed(0)}/sq ft
                                        </span>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                        <p className="text-xs text-gray-500">
                                            Zone: <span className="font-medium capitalize">{property.zone_type}</span> •
                                            Age: <span className="font-medium">{property.property_age_years} years</span>
                                        </p>
                                    </div>
                                    {property.amenities && property.amenities.length > 0 && (
                                        <div className="mt-2.5 flex flex-wrap gap-1">
                                            {property.amenities.slice(0, 4).map((amenity, idx) => (
                                                <span key={idx} className="text-[10px] bg-sand-200/60 text-charcoal-600 px-1.5 py-0.5 rounded-sm border border-sand-300 whitespace-nowrap">
                                                    {amenity}
                                                </span>
                                            ))}
                                            {property.amenities.length > 4 && (
                                                <span className="text-[10px] bg-forest-50/80 text-forest-700 px-1.5 py-0.5 rounded-sm border border-forest-200 font-medium whitespace-nowrap">
                                                    +{property.amenities.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MarkerClusterGroup>
        </MapContainer>
    );
}

export default MapView;

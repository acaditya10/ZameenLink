import React, { useState, useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import MapView from './components/MapView';
import PredictionPanel from './components/PredictionPanel';
import Analytics from './components/Analytics';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import SortOptions from './components/SortOptions';
import PropertyList from './components/PropertyList';
import LoginButton from './components/LoginButton';
import ProfilePanel from './components/ProfilePanel';
import AuthPrompt from './components/AuthPrompt';
import { AnalyticsSkeleton } from './components/LoadingSkeleton';
import { useAuth } from './contexts/AuthContext';
import { fetchProperties, fetchMetrics } from './api/apiClient';
import { Map, Layers } from 'lucide-react';

function App() {
  const [properties, setProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]); // Store all for client-side filtering
  const [filteredProperties, setFilteredProperties] = useState([]); // After filters
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapLayer, setMapLayer] = useState('osm');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSort, setCurrentSort] = useState('price-asc');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [propsData, metricsData] = await Promise.all([
        fetchProperties(),
        fetchMetrics()
      ]);
      const props = propsData.properties || [];
      setProperties(props);
      setAllProperties(props);
      setFilteredProperties(props);
      setMetrics(metricsData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setPrediction(null); // Reset prediction when selecting new property
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredProperties(allProperties);
      applySort(allProperties, currentSort);
      return;
    }

    const filtered = allProperties.filter(p =>
      p.area_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProperties(filtered);
    applySort(filtered, currentSort);

    if (filtered.length === 0) {
      toast.error('No properties found matching your search.', { icon: '🔍' });
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = [...allProperties];

    // Apply price filter
    if (filters.priceRange) {
      filtered = filtered.filter(p =>
        p.actual_fair_value >= filters.priceRange.min &&
        p.actual_fair_value <= filters.priceRange.max
      );
    }

    // Apply BHK filter
    if (filters.bhk && filters.bhk.length > 0) {
      filtered = filtered.filter(p => filters.bhk.includes(p.bhk));
    }

    // Apply area filter
    if (filters.areas && filters.areas.length > 0) {
      filtered = filtered.filter(p => filters.areas.includes(p.area_name));
    }

    setFilteredProperties(filtered);
    applySort(filtered, currentSort);

    toast.success(`Found ${filtered.length} properties`, {
      icon: '✓',
      duration: 2000
    });
  };

  const applySort = (propsToSort, sortId) => {
    let sorted = [...propsToSort];

    switch (sortId) {
      case 'price-asc':
        sorted.sort((a, b) => a.actual_fair_value - b.actual_fair_value);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.actual_fair_value - a.actual_fair_value);
        break;
      case 'size-asc':
        sorted.sort((a, b) => a.plot_size_sqft - b.plot_size_sqft);
        break;
      case 'size-desc':
        sorted.sort((a, b) => b.plot_size_sqft - a.plot_size_sqft);
        break;
      case 'area-asc':
        sorted.sort((a, b) => a.area_name.localeCompare(b.area_name));
        break;
      case 'bhk-asc':
        sorted.sort((a, b) => a.bhk - b.bhk);
        break;
      case 'bhk-desc':
        sorted.sort((a, b) => b.bhk - a.bhk);
        break;
      default:
        break;
    }

    setProperties(sorted);
  };

  const handleSortChange = (sortId) => {
    setCurrentSort(sortId);
    applySort(filteredProperties, sortId);
    toast.success('Properties sorted', { icon: '↕️', duration: 1500 });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-xl font-semibold text-gray-700 animate-pulse">Loading ZameenLink Map...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to ML Backend</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div
        className="h-screen flex flex-col bg-sand-100 overflow-hidden font-sans text-charcoal-500"
        role="main"
        aria-label="ZameenLink Property Finder"
      >
        {/* Header */}
        <header
          className="bg-forest-500 text-sand-50 shadow-xl z-[3000] relative shrink-0 border-b border-gold-500/30"
          role="banner"
        >
          <div className="pl-3 pr-4 py-3">
            <div className="grid grid-cols-3 items-center gap-4">
              {/* Left: Logo */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 bg-sand-100/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-sand-50/20 p-2"
                  aria-hidden="true"
                >
                  <svg className="w-full h-full text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-sand-50">ZameenLink</h1>
                  <p className="text-xs text-gold-400 uppercase tracking-wider font-semibold">ML Property Predictor</p>
                </div>
              </div>

              {/* Center: Search Bar */}
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <SearchBar onSearch={handleSearch} />
                </div>
              </div>

              {/* Right: Property Count + Login */}
              <div className="flex justify-end items-center gap-3">
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-sand-50/20">
                  <span className="text-sm font-semibold text-sand-50">
                    {properties.length} {properties.length === 1 ? 'property' : 'properties'}
                  </span>
                </div>
                <LoginButton 
                  onOpenProfile={() => {
                    setShowProfile(true);
                    setSelectedProperty(null);
                    setPrediction(null);
                  }}
                  onPropertySelect={(property) => {
                    handlePropertyClick(property);
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Property List Sidebar - Absolute positioned overlay */}
          <div className="absolute left-0 top-0 bottom-0 z-[1050]">
            <PropertyList
              properties={properties}
              selectedProperty={selectedProperty}
              onPropertySelect={handlePropertyClick}
              isOpen={isSidebarOpen}
              onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          </div>

          {/* Map Section - Full width */}
          <div className="flex-1 relative h-full w-full">
            {/* Filter Bar - Right side */}
            <div className="absolute top-4 right-4 z-[1000] flex gap-2 flex-wrap justify-end">
              <button
                onClick={() => setMapLayer(prev => prev === 'osm' ? 'satellite' : 'osm')}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg shadow-sm transition-all h-[42px] w-[130px] ${
                  mapLayer === 'satellite' 
                    ? 'border-forest-500 bg-forest-50 text-forest-800 font-semibold shadow-md' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 font-medium'
                }`}
                aria-label="Toggle map layer"
                title={mapLayer === 'osm' ? "Switch to Satellite View" : "Switch to Default Map"}
              >
                {mapLayer === 'osm' ? (
                  <>
                    <Map className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm">Map View</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4 text-forest-600 flex-shrink-0" />
                    <span className="text-sm">Satellite</span>
                  </>
                )}
              </button>
              <FilterPanel
                properties={allProperties}
                onFilterChange={handleFilterChange}
              />
              <SortOptions
                onSortChange={handleSortChange}
                currentSort={currentSort}
              />
            </div>

            <MapView
              properties={properties}
              onPropertyClick={handlePropertyClick}
              selectedProperty={selectedProperty}
              showHeatmap={showHeatmap}
              mapLayer={mapLayer}
            />
          </div>

          {/* Side Panel (Sliding overlay on small screens, fixed on large) */}
          {selectedProperty && (
            <PredictionPanel
              property={selectedProperty}
              prediction={prediction}
              onClose={() => {
                setSelectedProperty(null);
                setPrediction(null);
              }}
              onPredict={setPrediction}
            />
          )}

          {/* Profile Panel */}
          {showProfile && user && (
            <ProfilePanel
              onClose={() => setShowProfile(false)}
              allProperties={allProperties}
              onPropertySelect={(property) => {
                handlePropertyClick(property);
                setShowProfile(false);
              }}
            />
          )}
        </div>

        {/* Auth Prompt Modal */}
        <AuthPrompt />

        {/* Analytics Footer */}
        {loading ? (
          <AnalyticsSkeleton />
        ) : (
          metrics && <Analytics metrics={metrics} />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;

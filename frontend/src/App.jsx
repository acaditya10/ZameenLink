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
import { usePropertyFilters } from './hooks/usePropertyFilters';
import { usePropertySort } from './hooks/usePropertySort';
import { usePropertySearch } from './hooks/usePropertySearch';
import toast from 'react-hot-toast';

function App() {
  const [allProperties, setAllProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapLayer, setMapLayer] = useState('osm');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useAuth();

  // Custom hooks
  const { filters, filteredProperties, uniqueAreas, uniqueBHK, priceMin, priceMax, activeFilterCount, updateFilters, resetFilters } = usePropertyFilters(allProperties);
  const { currentSort, sortProperties, handleSortChange } = usePropertySort();
  const { searchQuery, searchProperties, handleSearch } = usePropertySearch(filteredProperties);

  // Apply sorting to filtered properties
  const sortedProperties = sortProperties(filteredProperties, currentSort);

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
      setAllProperties(props);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setPrediction(null);
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
    toast.success(`Found ${filteredProperties.length} properties`, {
      icon: '✓',
      duration: 2000
    });
  };

  const handleSearchWithToast = (query) => {
    handleSearch(query);
    const results = searchProperties(query);
    if (query.trim() && results.length === 0) {
      toast.error('No properties found matching your search.', { icon: '🔍' });
    }
  };

  const handleSortChangeWithToast = (sortId) => {
    handleSortChange(sortId);
    toast.success('Properties sorted', { icon: '↕️', duration: 1500 });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-forest-50 to-sand-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-forest-200 border-t-forest-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-xl font-semibold text-charcoal-500 animate-pulse">Loading ZameenLink Map...</p>
          <p className="text-sm text-sand-700 mt-2">Connecting to ML Backend</p>
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
            <div className="flex flex-col sm:grid sm:grid-cols-3 items-center gap-3 sm:gap-4">
              {/* Left: Logo */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 bg-sand-50/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-sand-50/20 p-2 hover:bg-sand-50/20 transition-colors"
                  aria-hidden="true"
                >
                  <svg className="w-full h-full text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-sand-50">ZameenLink</h1>
                  <p className="text-xs text-gold-400 uppercase tracking-wider font-semibold">ML Property Predictor</p>
                </div>
              </div>

              {/* Center: Search Bar */}
              <div className="flex justify-center order-3 sm:order-2">
                <div className="w-full max-w-md">
                  <SearchBar onSearch={handleSearchWithToast} />
                </div>
              </div>

              {/* Right: Property Count + Login */}
              <div className="flex justify-end items-center gap-2 sm:gap-3 order-2 sm:order-3">
                <div className="bg-sand-50/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-sm border border-sand-50/20">
                  <span className="text-xs sm:text-sm font-semibold text-sand-50">
                    {sortedProperties.length} {sortedProperties.length === 1 ? 'property' : 'properties'}
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
              properties={sortedProperties}
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
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 border rounded-xl shadow-sm transition-all duration-200 h-[42px] w-[110px] sm:w-[130px] focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  mapLayer === 'satellite'
                    ? 'border-forest-500 bg-forest-50 text-forest-800 font-semibold shadow-md'
                    : 'bg-sand-50 border-sand-300 text-charcoal-500 hover:bg-sand-100 font-medium'
                }`}
                aria-label="Toggle map layer"
                title={mapLayer === 'osm' ? "Switch to Satellite View" : "Switch to Default Map"}
              >
                {mapLayer === 'osm' ? (
                  <>
                    <Map className="w-4 h-4 text-forest-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Map View</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4 text-forest-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Satellite</span>
                  </>
                )}
              </button>
              <FilterPanel
                properties={allProperties}
                onFilterChange={handleFilterChange}
              />
              <SortOptions
                onSortChange={handleSortChangeWithToast}
                currentSort={currentSort}
              />
            </div>

            <MapView
              properties={sortedProperties}
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

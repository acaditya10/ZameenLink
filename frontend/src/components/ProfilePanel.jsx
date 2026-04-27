import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSavedProperties, getPredictionHistory, removeSavedProperty } from '../services/firestoreService';
import { formatPrice } from '../utils/formatters';
import { X, Bookmark, History, Trash2, MapPin, Home, TrendingUp, Loader2 } from 'lucide-react';

function ProfilePanel({ onClose, onPropertySelect, allProperties = [] }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('saved');
  const [savedProperties, setSavedProperties] = useState([]);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [saved, history] = await Promise.all([
        getSavedProperties(user.uid),
        getPredictionHistory(user.uid),
      ]);
      setSavedProperties(saved);
      setPredictionHistory(history);
    } catch (error) {
      console.error('Failed to load profile data:', error);
    }
    setLoading(false);
  };

  const handleRemoveSaved = async (propertyId) => {
    try {
      await removeSavedProperty(user.uid, propertyId);
      setSavedProperties((prev) => prev.filter((p) => String(p.property_id) !== String(propertyId)));
    } catch (error) {
      console.error('Failed to remove property:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (!user) return null;

  const tabs = [
    { id: 'saved', label: 'Saved', icon: Bookmark, count: savedProperties.length },
    { id: 'history', label: 'History', icon: History, count: predictionHistory.length },
  ];

  return (
    <div className="absolute right-0 top-0 h-full w-full md:w-96 bg-sand-50 shadow-2xl overflow-y-auto z-[1100] border-l border-sand-300 transition-transform duration-300 ease-in-out">
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-charcoal-500/30 backdrop-blur-sm md:hidden -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Header - User Info */}
      <div className="sticky top-0 bg-gradient-to-br from-forest-500 to-forest-700 text-sand-50 p-5 z-20 shadow-md">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-12 h-12 rounded-full border-2 border-gold-400/50"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-sand-50 text-lg font-bold">
                {(user.displayName || 'U')[0].toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold">{user.displayName || 'User'}</h2>
              <p className="text-xs text-gold-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-sand-50/20 p-2 rounded-lg transition-all duration-200 text-sand-100 hover:text-sand-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
            aria-label="Close profile"
          >
            <X size={22} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-sand-50/10 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-500 ${
                activeTab === tab.id
                  ? 'bg-sand-50 text-forest-700 shadow-sm'
                  : 'text-sand-200 hover:text-sand-50 hover:bg-sand-50/10'
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-forest-100 text-forest-700'
                    : 'bg-sand-50/20 text-sand-50'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-sand-700">
            <Loader2 size={32} className="animate-spin mb-3 text-forest-600" />
            <p className="text-sm">Loading...</p>
          </div>
        ) : activeTab === 'saved' ? (
          /* Saved Properties Tab */
          savedProperties.length === 0 ? (
            <div className="text-center py-16 text-sand-700">
              <Bookmark size={40} className="mx-auto mb-3 opacity-50 text-sand-500" />
              <p className="font-medium text-charcoal-500">No saved properties</p>
              <p className="text-sm mt-1">Click the bookmark icon on any property to save it here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedProperties.map((property) => (
                <div
                  key={property.property_id}
                  className="bg-sand-100 rounded-xl p-4 border border-sand-300 hover:border-forest-300 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between">
                    <button
                      onClick={() => {
                        onPropertySelect(property);
                        onClose();
                      }}
                      className="flex-1 text-left focus:outline-none focus:ring-2 focus:ring-forest-500 rounded"
                    >
                      <h3 className="font-semibold text-charcoal-500 group-hover:text-forest-700 transition-colors flex items-center gap-1">
                        <MapPin size={14} className="text-forest-600" />
                        {property.area_name}
                      </h3>
                      <p className="text-lg font-bold text-forest-600 mt-1">
                        {formatPrice(property.actual_fair_value)}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-sand-700">
                        <span className="flex items-center gap-1">
                          <Home size={12} /> {property.bhk} BHK
                        </span>
                        <span>{property.plot_size_sqft} sq ft</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleRemoveSaved(property.property_id)}
                      className="text-sand-600 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label="Remove saved property"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-sand-600 mt-2">
                    Saved {formatDate(property.savedAt)}
                  </p>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Prediction History Tab */
          predictionHistory.length === 0 ? (
            <div className="text-center py-16 text-sand-700">
              <History size={40} className="mx-auto mb-3 opacity-50 text-sand-500" />
              <p className="font-medium text-charcoal-500">No prediction history</p>
              <p className="text-sm mt-1">Your price predictions will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {predictionHistory.map((entry) => {
                // Try to find the full property object so we can navigate to it
                const matchedProperty = allProperties.find(
                  (p) => String(p.property_id) === String(entry.propertyId)
                );
                return (
                <button
                  key={entry.id}
                  onClick={() => {
                    if (matchedProperty) {
                      onPropertySelect(matchedProperty);
                    }
                  }}
                  className={`w-full text-left bg-sand-100 rounded-xl p-4 border border-sand-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                    matchedProperty ? 'hover:border-forest-300 cursor-pointer group' : 'opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-charcoal-500 flex items-center gap-1 text-sm group-hover:text-forest-700 transition-colors">
                        <MapPin size={13} className="text-forest-600" />
                        {entry.areaName}
                      </h3>
                      <p className="text-lg font-bold text-forest-600 mt-1">
                        {formatPrice(entry.predictedPrice)}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      entry.riskLevel === 'LOW' || entry.riskLevel === 'BARGAIN'
                        ? 'bg-forest-100 text-forest-700'
                        : entry.riskLevel === 'MEDIUM'
                        ? 'bg-gold-100 text-gold-700'
                        : entry.riskLevel === 'HIGH' || entry.riskLevel === 'CRITICAL'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-sand-200 text-sand-700'
                    }`}>
                      {entry.riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-sand-700">
                    <span>{entry.bhk} BHK</span>
                    <span>{entry.plotSize} sq ft</span>
                    <span>₹{entry.pricePerSqft?.toFixed(0)}/sq ft</span>
                  </div>
                  <p className="text-xs text-sand-600 mt-2">
                    {formatDate(entry.createdAt)}
                  </p>
                </button>
              );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ProfilePanel;

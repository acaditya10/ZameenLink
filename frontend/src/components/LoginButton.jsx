import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, User, LogOut, ChevronDown, Bookmark, MapPin, Loader2 } from 'lucide-react';
import { getSavedProperties } from '../services/firestoreService';

function LoginButton({ onOpenProfile, onPropertySelect }) {
  const { user, signInWithGoogle, signOut, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (dropdownOpen && user) {
      setLoadingProps(true);
      getSavedProperties(user.uid)
        .then(data => {
            setSavedProperties(data);
            setLoadingProps(false);
        })
        .catch(err => {
            console.error(err);
            setLoadingProps(false);
        });
    }
  }, [dropdownOpen, user]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse" />
    );
  }

  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="flex items-center gap-2 bg-sand-50/20 hover:bg-sand-50/30 backdrop-blur-sm text-sand-50 px-4 py-2 rounded-lg transition-all duration-200 border border-sand-50/30 hover:border-sand-50/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-forest-500"
        aria-label="Sign in with Google"
      >
        <LogIn size={16} />
        <span className="hidden sm:inline">Sign In</span>
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 bg-sand-50/20 hover:bg-sand-50/30 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-all duration-200 border border-sand-50/30 hover:border-sand-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-forest-500"
        aria-label="User menu"
        aria-expanded={dropdownOpen}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-7 h-7 rounded-full border-2 border-gold-400/50"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center text-sand-50 text-xs font-bold">
            {(user.displayName || user.email || 'U')[0].toUpperCase()}
          </div>
        )}
        <span className="text-sand-50 text-sm font-medium hidden sm:inline max-w-[100px] truncate">
          {user.displayName || 'User'}
        </span>
        <ChevronDown size={14} className={`text-sand-200 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-sand-50 rounded-xl shadow-xl border border-sand-300 overflow-hidden z-[2000] animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-3 border-b border-sand-300 bg-sand-100">
            <p className="text-sm font-semibold text-charcoal-500 truncate">{user.displayName}</p>
            <p className="text-xs text-sand-700 truncate">{user.email}</p>
          </div>

          {/* Saved Properties Dropdown Area */}
          <div className="max-h-60 overflow-y-auto">
            <div className="px-4 py-2 border-b border-sand-300 bg-forest-50 flex items-center gap-2 sticky top-0 z-10">
                <Bookmark size={14} className="text-forest-600" />
                <span className="text-xs font-semibold text-forest-800 uppercase tracking-wider">Saved Properties</span>
            </div>

            {loadingProps ? (
                <div className="py-6 flex flex-col items-center justify-center text-forest-600">
                    <Loader2 size={24} className="animate-spin mb-2" />
                    <span className="text-xs text-sand-700">Loading...</span>
                </div>
            ) : savedProperties.length > 0 ? (
                savedProperties.map(prop => (
                    <button
                        key={prop.property_id}
                        onClick={() => {
                            setDropdownOpen(false);
                            if (onPropertySelect) onPropertySelect(prop);
                        }}
                        className="w-full text-left px-4 py-3 border-b border-sand-200 hover:bg-sand-100 transition-colors group flex items-start gap-3 focus:outline-none focus:bg-sand-100"
                    >
                        <div className="bg-forest-100 text-forest-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                            #{prop.property_id}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-charcoal-500 truncate flex items-center gap-1 group-hover:text-forest-700">
                                <MapPin size={12} className="text-forest-500 flex-shrink-0" />
                                <span className="truncate">{prop.area_name}</span>
                            </p>
                            <p className="text-xs text-gold-600 mt-0.5 font-semibold">
                                ₹{(prop.actual_fair_value / 100000).toFixed(2)} Lakhs
                            </p>
                        </div>
                    </button>
                ))
            ) : (
                <div className="py-6 px-4 text-center text-sm text-sand-700">
                    No properties saved yet
                </div>
            )}
          </div>

          <div className="border-t border-sand-300 bg-sand-100">
            <button
               onClick={() => {
                 setDropdownOpen(false);
                 onOpenProfile();
               }}
               className="w-full flex items-center gap-3 px-4 py-3 text-sm text-charcoal-500 hover:text-forest-700 hover:bg-forest-50 transition-colors focus:outline-none focus:bg-forest-50"
            >
               <User size={16} />
               My Profile & History
            </button>
            <button
               onClick={() => {
                 setDropdownOpen(false);
                 signOut();
               }}
               className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-sand-300 focus:outline-none focus:bg-red-50"
            >
               <LogOut size={16} />
               Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginButton;

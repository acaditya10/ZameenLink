import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Sparkles, BookmarkPlus, History } from 'lucide-react';

function AuthPrompt() {
  const { showAuthPrompt, dismissAuthPrompt, signInWithGoogle } = useAuth();

  if (!showAuthPrompt) return null;

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal-500/50 backdrop-blur-sm"
        onClick={dismissAuthPrompt}
      />

      {/* Modal */}
      <div className="relative bg-sand-50 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 fade-in border border-sand-300">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-forest-500 to-forest-700 px-6 pt-8 pb-6 text-center">
          <div className="w-16 h-16 bg-sand-50/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Shield className="text-gold-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-sand-50">Unlock Full Access</h2>
          <p className="text-sand-200 text-sm mt-2">
            Sign in to continue exploring with unlimited predictions
          </p>
        </div>

        {/* Features */}
        <div className="px-6 py-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} className="text-forest-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal-500">Unlimited Predictions</p>
              <p className="text-xs text-sand-700">Run as many price predictions as you want</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookmarkPlus size={16} className="text-forest-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal-500">Save Properties</p>
              <p className="text-xs text-sand-700">Bookmark and revisit your favorite listings</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <History size={16} className="text-forest-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal-500">Prediction History</p>
              <p className="text-xs text-sand-700">Track all your past property analyses</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-forest-600 hover:bg-forest-700 text-sand-50 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-forest-500/20 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" opacity="0.8" />
              <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" opacity="0.6" />
              <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" opacity="0.4" />
            </svg>
            Sign in with Google
          </button>

          <button
            onClick={dismissAuthPrompt}
            className="w-full text-sand-700 hover:text-charcoal-500 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-forest-500 rounded"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPrompt;

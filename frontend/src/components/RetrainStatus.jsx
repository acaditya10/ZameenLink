import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, AlertTriangle } from 'lucide-react';
import { triggerRetrain, fetchRetrainStatus } from '../api/apiClient';
import toast from 'react-hot-toast';

function RetrainStatus() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStatus();
        const interval = setInterval(loadStatus, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    const loadStatus = async () => {
        try {
            const data = await fetchRetrainStatus();
            setStatus(data);
        } catch (error) {
            console.error('Failed to load retrain status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRetrain = async () => {
        if (status?.status === 'running') return;
        
        try {
            toast.loading('Starting model retrain...', { id: 'retrain' });
            await triggerRetrain();
            toast.success('Retrain started in background', { id: 'retrain' });
            loadStatus();
        } catch (error) {
            toast.error('Failed to start retrain', { id: 'retrain' });
        }
    };

    if (loading && !status) return <div className="text-xs text-gray-500 animate-pulse">Loading status...</div>;
    if (!status) return null;

    const isRunning = status.status === 'running';
    const lastTime = status.last_retrain ? new Date(status.last_retrain).toLocaleString() : 'Never';

    return (
        <div className="flex items-center gap-4 text-xs mt-3 pt-3 border-t border-sand-300">
            <div className="flex items-center gap-1 text-charcoal-light">
                <Clock size={14} />
                <span>Last Retrain: <span className="font-semibold text-forest-800">{lastTime}</span></span>
            </div>
            
            {status.status === 'failed' && (
                <div className="flex items-center gap-1 text-red-600">
                    <AlertTriangle size={14} />
                    <span>Failed: {status.error}</span>
                </div>
            )}

            <div className="flex-1 text-right">
                <button
                    onClick={handleRetrain}
                    disabled={isRunning}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-colors ml-auto ${
                        isRunning 
                        ? 'bg-gold-100 text-gold-700 cursor-not-allowed' 
                        : 'bg-forest-100 text-forest-700 hover:bg-forest-200 cursor-pointer'
                    }`}
                >
                    <RefreshCw size={14} className={isRunning ? 'animate-spin' : ''} />
                    {isRunning ? 'Retraining...' : 'Trigger Manual Retrain'}
                </button>
            </div>
        </div>
    );
}

export default RetrainStatus;

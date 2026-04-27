import React from 'react';

// Generic Skeleton component
export const Skeleton = ({ className = '', variant = 'rectangular' }) => {
    const baseClasses = 'animate-pulse bg-gradient-to-r from-sand-200 via-sand-300 to-sand-200 bg-[length:200%_100%]';

    const variantClasses = {
        rectangular: 'rounded',
        circular: 'rounded-full',
        text: 'rounded h-4'
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            role="status"
            aria-label="Loading content"
        />
    );
};

// Property List Skeleton (for map markers loading)
export const PropertyListSkeleton = () => {
    return (
        <div className="absolute top-4 left-4 z-[1000] bg-sand-50 rounded-lg shadow-lg p-4 w-64 border border-sand-300">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-sand-200 last:border-0">
                        <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Prediction Panel Skeleton
export const PredictionSkeleton = () => {
    return (
        <div className="space-y-4 p-6">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
            </div>

            {/* Price prediction */}
            <div className="bg-sand-100 rounded-lg p-4 space-y-3 border border-sand-300">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-full" />
            </div>

            {/* Scam alert placeholder */}
            <Skeleton className="h-20 w-full rounded-lg" />

            {/* Details */}
            <div className="space-y-3">
                <Skeleton className="h-5 w-40" />
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                ))}
            </div>

            {/* Nearby properties */}
            <div className="space-y-3">
                <Skeleton className="h-5 w-40" />
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-sand-100 rounded-lg p-3 space-y-2 border border-sand-200">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                    </div>
                ))}
            </div>

            {/* Action button */}
            <Skeleton className="h-12 w-full rounded-lg" />
        </div>
    );
};

// Analytics Section Skeleton
export const AnalyticsSkeleton = () => {
    return (
        <div className="bg-sand-50 border-t border-forest-500/20 p-6 shrink-0">
            <div className="container mx-auto">
                <Skeleton className="h-7 w-56 mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Model cards */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-sand-100 rounded-lg p-4 space-y-3 border border-sand-300">
                            <Skeleton className="h-5 w-32" />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chart skeleton */}
                <div className="mt-6">
                    <Skeleton className="h-64 w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
};

// Map Loading Skeleton
export const MapSkeleton = () => {
    return (
        <div className="w-full h-full bg-sand-100 flex items-center justify-center">
            <div className="text-center space-y-4">
                <Skeleton variant="circular" className="w-16 h-16 mx-auto" />
                <Skeleton className="h-4 w-40 mx-auto" />
                <Skeleton className="h-3 w-56 mx-auto" />
            </div>
        </div>
    );
};

export default Skeleton;

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.error('Error Boundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleRefresh = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
                <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                        <div className="mb-6">
                            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-10 h-10 text-red-600" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Oops! Something went wrong
                        </h1>

                        <p className="text-gray-600 mb-6">
                            We're sorry for the inconvenience. The application encountered an unexpected error.
                        </p>

                        {/* Show error details in development */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                                    Error Details (Development Only)
                                </summary>
                                <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-48">
                                    <p className="text-xs text-red-600 font-mono mb-2">
                                        {this.state.error.toString()}
                                    </p>
                                    {this.state.errorInfo && (
                                        <pre className="text-xs text-gray-600 font-mono whitespace-pre-wrap">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    )}
                                </div>
                            </details>
                        )}

                        <button
                            onClick={this.handleRefresh}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                            aria-label="Refresh the page"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Refresh Page
                        </button>

                        <p className="mt-4 text-sm text-gray-500">
                            If the problem persists, please contact support.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

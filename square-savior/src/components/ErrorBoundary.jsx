import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
                        <p className="text-gray-400 mb-6">The audio player encountered an error.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-white text-black px-6 py-3 rounded-md font-bold hover:bg-cyan-400"
                        >
                            Reload App
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

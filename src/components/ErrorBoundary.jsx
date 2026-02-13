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
        console.error("Uncaught error:", error, errorInfo);
    }

    handleRestart = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6 text-center">
                    <div className="bg-red-500/10 p-4 rounded-full mb-4">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Something went wrong.</h1>
                    <p className="text-gray-400 mb-6 max-w-md">
                        We encountered an unexpected error. Don't worry, your progress is safe.
                    </p>
                    <button
                        onClick={this.handleRestart}
                        className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg shadow-lg transition-colors"
                    >
                        Refresh App
                    </button>

                    {process.env.NODE_ENV === 'development' && (
                        <pre className="mt-8 p-4 bg-black/50 rounded text-left text-xs text-red-300 overflow-auto max-w-full">
                            {this.state.error && this.state.error.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

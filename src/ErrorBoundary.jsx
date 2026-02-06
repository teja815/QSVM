import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // You could also log to an external service here
    // console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-bold mb-4">An unexpected error occurred</h1>
            <p className="mb-4">The application encountered a runtime error. This usually shows up as a blank page in production.</p>
            <details className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-3 rounded">
              <summary className="cursor-pointer font-medium">Show error details</summary>
              <div style={{ marginTop: 8 }}>
                <div><strong>Error:</strong> {String(this.state.error && this.state.error.toString())}</div>
                <div style={{ marginTop: 8 }}><strong>Stack / Info:</strong></div>
                <pre className="text-xs mt-2">{this.state.info?.componentStack || 'N/A'}</pre>
              </div>
            </details>
            <p className="mt-4">Open the browser console to see the full stack trace. If you want, I can add remote error logging.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

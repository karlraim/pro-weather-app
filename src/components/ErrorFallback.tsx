import React from 'react';

interface Props {
    error: Error;
    resetErrorBoundary(): void;
}

const ErrorFallback: React.FC<Props> = ({ error, resetErrorBoundary }) => {
    return (
        <div>
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    );
};

export default ErrorFallback;

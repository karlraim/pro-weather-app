import React from 'react';
import ReactDOM from 'react-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useStickyState } from './utils/customHooks';
import ErrorFallback from './components/ErrorFallback';
import WeatherProvider from './components/WeatherProvider';
import Search from './components/Search';
import { WeatherData } from './components/WeatherProvider';
import './App.scss';
import Weather from './components/Weather';

export interface UserLocation {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
}

const App: React.FC = () => {
    const initialState = {
        userLocation: null,
        page: 'search',
    };
    const [userLocation, setUserLocation] = useStickyState<UserLocation | null>(
        initialState.userLocation,
        'pwa-user-location',
    );

    const [page, setPage] = useStickyState<string>(initialState.page, 'pwa-page');

    function resetState() {
        setUserLocation(initialState.userLocation);
        setPage(initialState.page);
    }

    return (
        <div className="App">
            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => {
                    resetState();
                }}
            >
                {page === 'search' ? (
                    <Search setUserLocation={setUserLocation} setPage={setPage} />
                ) : (
                    <WeatherProvider userLocation={userLocation} resetState={resetState}>
                        {(weather: WeatherData) => (
                            <Weather weather={weather} userLocation={userLocation} setPage={setPage} />
                        )}
                    </WeatherProvider>
                )}
            </ErrorBoundary>
        </div>
    );
};

export default App;
ReactDOM.render(<App />, document.getElementById('root'));

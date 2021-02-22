import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { useStickyState } from '../utils/customHooks';
import { UserLocation } from '../App';
import ErrorBox from './ErrorBox';

interface Props {
    userLocation: UserLocation | null;
    children(weather: WeatherData): React.ReactNode;
    resetState(): void;
}

interface WeatherDescription {
    id: number;
    main: string;
    description: string;
}

export interface WeatherData {
    current: {
        temp: number;
        weather: Array<WeatherDescription>;
    };
    daily: Array<{
        dt: number;
        temp: {
            morn: number;
            day: number;
            eve: number;
            night: number;
        };
        weather: Array<WeatherDescription>;
    }>;
}

const WeatherProvider: React.FC<Props> = ({ userLocation, children, resetState }) => {
    const [weather, setWeather] = useStickyState<WeatherData | null>(null, 'pwa-weather');
    const [error, setError] = useState<null | string>(null);

    useEffect(() => {
        userLocation && fetchWeather();
    }, [userLocation]);

    const fetchWeather = async () => {
        if (userLocation) {
            const API_KEY = process.env.REACT_APP_OWM_API_KEY;
            const exclude = 'minutely,hourly,alerts';
            const units = 'metric';
            const { latitude, longitude } = userLocation;
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=${exclude}&appid=${API_KEY}&units=${units}`,
                );
                setWeather(response.data);
            } catch (error) {
                setError(error.message);
            }
        }
    };

    if (error) {
        return (
            <ErrorBox
                message={error}
                wrapperClassName="weather-provider-error"
                onDismiss={() => {
                    setError(null);
                    resetState();
                }}
            />
        );
    }

    return <Fragment>{weather && children(weather)}</Fragment>;
};

export default WeatherProvider;

import React from 'react';
import { useStickyState } from '../utils/customHooks';
import Toggler from './Toggler';
import WeatherToday from './WeatherToday';
import WeeklyForecast from './WeeklyForecast';
import { WeatherData } from './WeatherProvider';
import { UserLocation } from '../App';
import './Weather.scss';

interface Props {
    weather: WeatherData;
    userLocation: UserLocation | null;
    setPage: React.Dispatch<React.SetStateAction<string>>;
}

const Weather: React.FC<Props> = ({ weather, userLocation, setPage }) => {
    const [usingFahrenheit, setUsingFahrenheit] = useStickyState<boolean>(false, 'pwa-using-fahrenheit');

    function formatTemp(temp: number): string {
        return usingFahrenheit ? Math.round((temp * 9) / 5 + 32) + '°F' : Math.round(temp) + '°C';
    }

    return (
        <div className="Weather">
            <div className="top">
                <div className="top-left">
                    <button
                        className="icon-button material-icons"
                        onClick={() => {
                            setPage('search');
                        }}
                    >
                        arrow_back
                    </button>
                    <span>{userLocation?.city + (userLocation?.country ? ` (${userLocation.country})` : '')}</span>
                </div>

                <Toggler
                    id="temp-toggler"
                    state={usingFahrenheit}
                    setState={setUsingFahrenheit}
                    labels={{ true: 'F°', false: 'C°' }}
                />
            </div>
            <WeatherToday weather={weather} formatTemp={formatTemp} />
            <WeeklyForecast weather={weather} formatTemp={formatTemp} />
        </div>
    );
};

export default Weather;

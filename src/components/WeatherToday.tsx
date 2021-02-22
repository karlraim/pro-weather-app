import React from 'react';
import { format } from 'date-fns';
import { capitalize } from '../utils/stringUtils';

import { WeatherData } from './WeatherProvider';

import './WeatherToday.scss';

interface Props {
    weather: WeatherData;
    formatTemp(temp: number): string;
}

const WeatherToday: React.FC<Props> = ({ weather, formatTemp }) => {
    const current = weather.current;
    const weeklyForecast = weather.daily.slice(0, 7);
    const tempToday = weeklyForecast[0].temp;

    return (
        <div className="WeatherToday">
            <div className="date">{format(new Date(), 'cccc, LLLL do yyyy')}</div>
            <div className="description">{capitalize(current.weather[0].description)}</div>
            <div className="bottom">
                <div className="current-temp">{formatTemp(current.temp)}</div>
                <i className={'wi wi-owm-' + current.weather[0].id}></i>
                <div className="day-temps">
                    <div className="day-temp">
                        <span>Morning</span>
                        <span>{formatTemp(tempToday.morn)}</span>
                    </div>
                    <div className="day-temp">
                        <span>Day</span>
                        <span>{formatTemp(tempToday.day)}</span>
                    </div>
                    <div className="day-temp">
                        <span>Evening</span>
                        <span>{formatTemp(tempToday.eve)}</span>
                    </div>
                    <div className="day-temp">
                        <span>Night</span>
                        <span>{formatTemp(tempToday.night)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherToday;

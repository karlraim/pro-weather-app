import React from 'react';
import { format } from 'date-fns';

import { WeatherData } from './WeatherProvider';

import './WeeklyForecast.scss';

interface Props {
    weather: WeatherData;
    formatTemp(temp: number): string;
}

const WeeklyForecast: React.FC<Props> = ({ weather, formatTemp }) => {
    const weeklyForecast = weather.daily.slice(0, 7);

    return (
        <div className="WeeklyForecast">
            {weeklyForecast.map((day) => {
                return (
                    <div className="day" key={day.dt}>
                        <div>{format(new Date(day.dt * 1000), 'cccc')}</div>
                        <i className={'wi wi-owm-' + day.weather[0].id} />
                        <div>{formatTemp(day.temp.day)}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default WeeklyForecast;

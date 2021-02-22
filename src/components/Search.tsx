import React, { Fragment, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useStickyState } from '../utils/customHooks';
import { UserLocation } from '../App';
import './Search.scss';
import ErrorBox from './ErrorBox';
import useEventListener from '@use-it/event-listener';

interface Props {
    setUserLocation: React.Dispatch<React.SetStateAction<UserLocation | null>>;
    setPage: React.Dispatch<React.SetStateAction<string>>;
}

interface LocationData {
    info: {
        statuscode: number;
        messages: Array<string>;
    };
    results: Array<{
        locations: Array<{
            adminArea1: string; // country code
            adminArea5: string; // city name
            latLng: {
                lat: number;
                lng: number;
            };
        }>;
    }>;
}

const Search: React.FC<Props> = ({ setUserLocation, setPage }) => {
    const [city, setCity] = useStickyState('', 'pwa-city');
    const [error, setError] = useState<null | string>(null);
    const [validationError, setValidationError] = useState<null | string>(null);
    const [isGeolocationSupported, setIsGeolocationSupported] = useState(true);
    const cityInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (cityInput.current) {
            cityInput.current.focus();
        }

        if (!window.navigator.geolocation) {
            console.log('This browser does not support geolocation. Using current location disabled.');
            setIsGeolocationSupported(false);
        }
    }, []);

    useEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (city) {
                locateByCity();
            } else if (isGeolocationSupported) {
                locateByGeolocationCoordinates();
            }
        }
    });

    async function locateByCity() {
        setError(null);
        if (!city) {
            setError('Enter city name.');
            return;
        }
        const response = await queryMapQuest(false, city);
        response && handleResponse(response, 'No cities with the provided name found.');
    }

    function locateByGeolocationCoordinates() {
        setError(null);
        setCity('');
        window.navigator.geolocation.getCurrentPosition(success, failure);
        async function success(pos: GeolocationPosition) {
            const { latitude, longitude } = pos.coords;
            const response = await queryMapQuest(true, `${latitude},${longitude}`);
            response && handleResponse(response, 'No cities with current position coordinates found.');
        }
        function failure(err: GeolocationPositionError) {
            setError(err.message);
        }
    }

    async function queryMapQuest(reverse: boolean, query: string) {
        const API_KEY = process.env.REACT_APP_MQ_API_KEY;
        const urlBase = 'https://www.mapquestapi.com/geocoding/v1/';
        const url = urlBase + (reverse ? 'reverse' : 'address') + `?key=${API_KEY}&location=${query}`;
        try {
            const response = await axios.get<LocationData>(url);
            return response.data;
        } catch (err) {
            setError(err.message);
        }
    }

    function handleResponse(locationData: LocationData, notFoundError: string) {
        const info = locationData.info;
        if (info.statuscode !== 0) {
            setError(info.messages.length ? `${info.statuscode}: ${info.messages.join(' ')}` : `${info.statuscode}`);
            return;
        }
        const locations = locationData.results[0].locations.filter((location) => location.adminArea5);
        if (locations.length) {
            const {
                adminArea1: country,
                adminArea5: city,
                latLng: { lat: latitude, lng: longitude },
            } = locations[0];
            setUserLocation({ latitude, longitude, city, country });
            setCity(city);
            setPage('weather');
        } else {
            setError(notFoundError);
        }
    }

    function validateInput(inputString: string) {
        const invalidFirstCharRegex = /[^a-zA-Z\d]/;
        const invalidCharsRegex = /[^\w-,. ]/g;
        if (invalidCharsRegex.test(inputString)) {
            setValidationError('Invalid characters.');
        } else if (inputString.length && invalidFirstCharRegex.test(inputString[0])) {
            setValidationError('First symbol has to be a letter or a number.');
        } else {
            setValidationError(null);
        }
    }

    return (
        <div className="Search">
            <div className="searchArea">
                <div className="inputArea">
                    <input
                        ref={cityInput}
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => {
                            setCity(e.target.value);
                            validateInput(e.target.value);
                        }}
                    />
                    <button
                        disabled={!!validationError}
                        className="icon-button material-icons"
                        onClick={() => locateByCity()}
                    >
                        search
                    </button>
                </div>
                {validationError && (
                    <ErrorBox
                        message={validationError}
                        wrapperClassName="validation-error"
                        onDismiss={() => {
                            setCity('');
                            setValidationError(null);
                        }}
                    />
                )}
                {isGeolocationSupported && (
                    <Fragment>
                        <p>or</p>
                        <div>
                            <span>use my </span>
                            <button className="text-button" onClick={() => locateByGeolocationCoordinates()}>
                                current position
                            </button>
                        </div>
                    </Fragment>
                )}
                {error && (
                    <ErrorBox
                        message={error}
                        wrapperClassName="search-error"
                        onDismiss={() => {
                            setError(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
};
export default Search;

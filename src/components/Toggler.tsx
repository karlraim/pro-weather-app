import React from 'react';
import './Toggler.scss';

interface Props {
    id: string;
    state: boolean;
    setState: React.Dispatch<React.SetStateAction<boolean>>;
    labels: {
        true: string;
        false: string;
    };
}

const Toggler: React.FC<Props> = ({ id, state, setState, labels }) => {
    return (
        <div className="toggle-switch">
            <input
                id={id}
                className="toggle-switch-checkbox"
                type="checkbox"
                onChange={() => {
                    setState(!state);
                }}
                checked={state}
            />
            <label className="toggle-switch-label" htmlFor={id}>
                <span className={'toggle-switch-inner'} label-true={labels.true} label-false={labels.false} />
                <span className={'toggle-switch-switch'} />
            </label>
        </div>
    );
};

export default Toggler;

import React, { useState } from 'react';
import './ErrorBox.scss';
interface Props {
    message: string;
    wrapperClassName: string;
    onDismiss(): void;
}

const ErrorBox: React.FC<Props> = ({ message, wrapperClassName, onDismiss }) => {
    const [hidden, setHidden] = useState(false);

    if (hidden) {
        return null;
    }

    return (
        <div className={`ErrorBox ${wrapperClassName}`}>
            <span onClick={() => setHidden(true)} className="material-icons error-icon">
                error
            </span>
            <span>{message}</span>
            <button
                className="icon-button material-icons"
                onClick={() => {
                    onDismiss();
                    setHidden(true);
                }}
            >
                cancel
            </button>
        </div>
    );
};

export default ErrorBox;

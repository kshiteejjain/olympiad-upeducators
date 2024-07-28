import React from 'react';
import './Button.css';

type Props = {
    title?: string;
    onClick?: () => void;
    isSecondary?: boolean;
    isDisabled?: boolean;
    type: 'button' | 'submit' | 'reset';
}

const Button: React.FC<Props> = ({ title, onClick, isSecondary, isDisabled, type }) => {
    return (
        <button 
            className={isSecondary ? 'isSecondary' : 'button'} 
            onClick={onClick} 
            disabled={isDisabled}
            type={type}
        >
            {title}
        </button>
    );
};

export default Button;

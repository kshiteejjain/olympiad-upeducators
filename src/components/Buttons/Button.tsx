import React from 'react';
import ChevronRight from '../../assets/chevron-right.svg';

import './Button.css';

type Props = {
    title?: string;
    onClick?: () => void;
    isSecondary?: boolean;
    isDisabled?: boolean;
    type: 'button' | 'submit' | 'reset';
    isArrow?: boolean;
    isIcon?: boolean;
    isError?: boolean;
    iconPath?: string;
};

const Button: React.FC<Props> = ({ title, onClick, isSecondary, isDisabled, type, isArrow, isIcon, isError, iconPath }) => {
    return (
        <button 
            className={`${isSecondary ? 'isSecondary' : 'button'} ${isError ? 'isError' : ''}`} 
            onClick={onClick} 
            disabled={isDisabled}
            type={type}
        >
            {title}
            {isArrow && <img src={ChevronRight} className='arrow' alt="Arrow" />}
            {isIcon && <img src={iconPath} className='icon' alt="Icon" />}
        </button>
    );
};

export default Button;

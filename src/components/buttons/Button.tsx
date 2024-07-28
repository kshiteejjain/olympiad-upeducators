import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

type Props = {
    title?: string;
    onClick?: () => void;
    isSecondary?: boolean;
    isDisabled?: boolean;
}

const Button: React.FC<Props> = ({ title, onClick, isSecondary, isDisabled }) => {
    return (
        <button 
            className={isSecondary ? 'isSecondary' : 'button'} 
            onClick={onClick} 
            disabled={isDisabled}
        >
            {title}
        </button>
    );
};

Button.propTypes = {
    title: PropTypes.string,
    onClick: PropTypes.func,
    isSecondary: PropTypes.bool,
    isDisabled: PropTypes.bool
};

export default Button;

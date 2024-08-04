import React from 'react';
import Close from '../../assets/close.svg';

import './Modal.css';

type Props = {
    data?: string | number,
    title?: string,
    modalTitle?: string,
    onClose: () => void,
    onCopy?: () => void,
    children?: React.ReactNode // Added children prop
};

const Modal = ({ data, modalTitle, onClose, children }: Props) => {
    // Ensure data is a string before applying transformations
    const transformedData = typeof data === 'string'
        ? data
            .replace(/\.\s/g, '.<br />') // Add <br /> after each full stop
            .replace(/(discount)(.*)/i, '$1<b>$2</b>') // Make text bold after 'discount'
        : ''; // Provide an empty string if data is not a string

    return (
        <div className='modal'>
            <div className='modal-content'>
                <span className='close' onClick={onClose}>
                    <img src={Close} alt="Close" />
                </span>
                <h2>{modalTitle}</h2>
                <p dangerouslySetInnerHTML={{ __html: transformedData }} />
                <div className='modal-footer'>{children}</div>
            </div>
            <div className='overlay' onClick={onClose}></div>
        </div>
    );
};

export default Modal;

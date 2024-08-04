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
    // Transform data to insert <br /> after each full stop and make text bold after 'discount'
    const transformedData = typeof data === 'string'
        ? data
            .replace(/\.\s/g, '.<br /><br />') // Add <br /> after each full stop
            .replace(/(discount)(.*)/i, '$1<b>$2</b>') // Make text bold after 'discount'
        : data;

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

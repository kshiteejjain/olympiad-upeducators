import React, { useState, useEffect } from 'react';
import Close from '../../assets/close.svg';

import './Modal.css';

type Props = {
    data?: string | number,
    title?: string,
    modalTitle?: string,
    open?: boolean, // Prop to control modal visibility
    onClose?: () => void,
    onCopy?: () => void,
    children?: React.ReactNode // Added children prop
};

const Modal = ({ data, modalTitle, open, onClose, children }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Sync modal open state with the 'open' prop from the parent component
    useEffect(() => {
        if (open !== undefined) {
            setIsModalOpen(open);
        }
    }, [open]);

    const closeModal = () => {
        setIsModalOpen(false);
        if (onClose) {
            onClose(); // Call the onClose prop if passed
        }
    };

    // Ensure data is a string before applying transformations
    const transformedData = typeof data === 'string'
        ? data
            .replace(/\.\s/g, '.<br />') // Add <br /> after each full stop
            .replace(/(discount)(.*)/i, '$1<b>$2</b>') // Make text bold after 'discount'
        : ''; // Provide an empty string if data is not a string

    if (!isModalOpen) return null; // Don't render the modal if it's closed

    return (
        <div className='modal'>
            <div className='modal-content'>
                <span className='close' onClick={closeModal}>
                    <img src={Close} alt="Close" />
                </span>
                <h2>{modalTitle}</h2>
                <p dangerouslySetInnerHTML={{ __html: transformedData }} />
                <div className='modal-footer'>{children}</div>
            </div>
            <div className='overlay' onClick={closeModal}></div>
        </div>
    );
};

export default Modal;

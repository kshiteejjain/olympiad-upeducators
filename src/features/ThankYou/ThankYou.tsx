import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThankYouImg from '../../assets/thankyou.svg';
import Button from '../../components/Buttons/Button';

import './ThankYou.css';

const ThankYou = () => {
    const [examOver, setExamOver] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Function to check the examOver property from localStorage
        const checkExamOver = () => {
            const olympdPrefixString = localStorage.getItem('olympd_prefix');
            const olympdPrefix = olympdPrefixString ? JSON.parse(olympdPrefixString) : {};
            setExamOver(!!olympdPrefix.examOver);
        };

        // Check the property immediately on mount
        checkExamOver();

        // Set up an interval to check the property every 3 seconds
        const intervalId = setInterval(checkExamOver, 3000);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array to run only on mount and unmount

    const handleClick = () => {
        navigate('/');
        // Update localStorage
        const olympdPrefixString = localStorage.getItem('olympd_prefix');
        let olympdPrefix = olympdPrefixString ? JSON.parse(olympdPrefixString) : {};
        delete olympdPrefix.examOver;
        localStorage.setItem('olympd_prefix', JSON.stringify(olympdPrefix));
    };

    return (
        <div className='thankyou'>
            <img src={ThankYouImg} alt='Thank You' title='Thank You' />
            {examOver ? 
            <div className='thankyou-note'>
                <h1>Thank You For Your Visit!</h1>
                <p>We appreciate your time and hope you found everything you were looking for.</p>
                <p><strong>Have a great day!</strong></p>
                <Button title='Go to olympiad home page' type='button' isSecondary onClick={handleClick} />
            </div>
            :
            <div className='thankyou-note'>
                <h1>upEducators</h1>
            </div>
            }
        </div>
    );
};

export default ThankYou;

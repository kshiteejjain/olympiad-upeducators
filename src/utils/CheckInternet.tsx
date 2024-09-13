import { useState, useEffect } from 'react';

const CheckInternet = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            alert('You are now connected to the internet!');
        };

        const handleOffline = () => {
            setIsOnline(false);
            alert('You have lost internet connection.');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Cleanup event listeners on component unmount
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <div>
            <h1>{isOnline ? '' : 'You lost the internet connection.'}</h1>
        </div>
    );
};

export default CheckInternet;

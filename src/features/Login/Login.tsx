import { useState, Suspense, lazy, useEffect } from 'react';

import './Login.css';

// Lazy load components
const LoginWithEmail = lazy(() => import('./LoginWithEmail'));
const LoginWithPhone = lazy(() => import('./LoginWithPhone'));
const EnterOTP = lazy(() => import('./EnterOTP'));

const Login = () => {
    const [isPhoneLogin, setIsPhoneLogin] = useState(true);
    const [showEnterOTP, setShowEnterOTP] = useState(false);

    useEffect(() => {
        const olympdPrefix = localStorage.getItem('olympd_prefix');
        if (olympdPrefix) {
            try {
                const olympdData = JSON.parse(olympdPrefix);
                if (olympdData.code) {
                    setShowEnterOTP(true);
                }
            } catch (error) {
                console.error('Failed to parse localStorage data:', error);
            }
        }
    }, []);
    const handleLoginToggle = () => {
        setIsPhoneLogin(prevState => !prevState);
    };

    return (
        <div className="login-wrapper">
            <div className="login-visual"></div>
            <div className="login-form">

                <Suspense fallback={<div>Loading...</div>}>
                    {showEnterOTP ? (
                        <EnterOTP />
                    ) : (
                        isPhoneLogin ? <LoginWithPhone /> : <LoginWithEmail />
                    )}
                </Suspense>
                <span className="login-option" onClick={handleLoginToggle}>
                    {isPhoneLogin ? 'Login With Email?' : 'Login With Phone?'}
                </span>
            </div>
        </div>
    );
};

export default Login;

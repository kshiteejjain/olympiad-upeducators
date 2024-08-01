import { useState, Suspense, lazy } from 'react';

import './Login.css';

// Lazy load components
const LoginWithEmail = lazy(() => import('./LoginWithEmail'));
const LoginWithPhone = lazy(() => import('./LoginWithPhone'));
const EnterOTP = lazy(() => import('./EnterOTP'));

const Login = () => {
    const [isPhoneLogin, setIsPhoneLogin] = useState(true);

    const handleLoginToggle = () => {
        setIsPhoneLogin(prevState => !prevState);
    };

    return (
        <div className="login-wrapper">
            <div className="login-visual"></div>
            <div className="login-form">
                
                <Suspense fallback={<div>Loading...</div>}>
                    {isPhoneLogin ? <EnterOTP /> : <LoginWithEmail />}
                </Suspense>

                <span className="login-option" onClick={handleLoginToggle}>
                    {isPhoneLogin ? 'Login With Email?' : 'Login With Phone?'}
                </span>
            </div>
        </div>
    );
};

export default Login;

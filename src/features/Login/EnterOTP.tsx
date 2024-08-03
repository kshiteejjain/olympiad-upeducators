import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '../../components/Buttons/Button';
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Loader from "../../components/Loader/Loader";
import LoginAnimation from "./LoginAnimation";

import './Login.css';



const EnterOTP = () => {
    const [otp, setOtp] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoader(true);

        const olympd_prefix = localStorage.getItem('olympd_prefix');
        if (olympd_prefix) {
            const user = JSON.parse(olympd_prefix);
            const code = user?.code;
            if (code === otp) {
                delete user.code;  // Remove the code property from the user object
                navigate('/LMSForm');
            } else {
                setIsError(true);
            }
        } else {
            setIsError(true);
        }
        setIsLoader(false);
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setOtp(value);
        setIsError(false);
    };

    useEffect(() => {
      // Check if localStorage has sessionId
      const olympdPrefix = localStorage.getItem('olympd_prefix');
      if (olympdPrefix) {
        try {
          const olympdData = JSON.parse(olympdPrefix);
          if (olympdData.sessionId) {
            navigate('/AboutOlympiad'); // Redirect to /AboutOlympiad
          }
        } catch (error) {
          console.error('Failed to parse localStorage data:', error);
        }
      }
    }, [navigate]);
    

    return (
        <><div className="login-wrapper">
            <div className="login-visual"></div>
            <div className="login-form">
                <LoginAnimation />
                {isLoader && <Loader title='Loading..' />}
                <form onSubmit={handleSubmit}>
                    <h1>Enter OTP</h1>
                    <div className='form-group'>
                        <label htmlFor='otp'>Enter OTP<span className="asterisk">*</span></label>
                        <input
                            type='tel'
                            className='form-control'
                            required
                            name='otp'
                            autoComplete='off'
                            value={otp}
                            onChange={handleOtpChange}
                            maxLength={10}
                        />
                        {isError && <ErrorBoundary message='Invalid OTP. Please try again.' />}
                        <p className='input-note'>Note: Enter OTP received on your registered email or mobile</p>
                    </div>
                    <Button title='Send' type='submit' />
                </form>
                <span className="login-option" onClick={()=> navigate('/')}>Back to login?</span>
            </div>
        </div>
        </>
    );
};

export default EnterOTP;

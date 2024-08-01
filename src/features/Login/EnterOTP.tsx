import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '../../components/Buttons/Button';
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Loader from "../../components/Loader/Loader";

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
        const user = JSON.parse(olympd_prefix);
        const code = user?.code;
        if (code === otp) {
            delete user.code;  // Remove the code property from the user object
            user.sessionId = 'z5pxv6w2chzvkjjf0y64'; // Add sessionId to the user object
            localStorage.setItem('olympd_prefix', JSON.stringify(user)); // Update localStorage with the modified object
            navigate('/AboutOlympiad');
            window.location.reload();
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

    return (
        <>
            {isLoader && <Loader title='Loading..' />}
            <h1>Enter OTP Number</h1>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='otp'>Enter OTP</label>
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
                    <p className='input-note'>Note: Enter OTP received on your registered email or mobile</p>
                    {isError && <ErrorBoundary message='Invalid OTP. Please try again.' />}
                </div>
                <Button title='Send' type='submit' />
            </form>
        </>
    );
};

export default EnterOTP;

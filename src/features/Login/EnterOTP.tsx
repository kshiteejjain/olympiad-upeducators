import { useState } from "react";
import Button from '../../components/Buttons/Button';
import ErrorBoundry from "../../components/ErrorBoundry/ErrorBoundry";
import Loader from "../../components/Loader/Loader";

import './Login.css';

const LoginWithotp = () => {
    const [otp, setOtp] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoader(true);

        const olympdCode = localStorage.getItem('olympdCode');
        const user = JSON.parse(olympdCode);
        const code = user?.code;
        if (code === otp) {
            localStorage.removeItem('olympiadOTP');
            alert('OPT Matched')
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
                    {isError && <ErrorBoundry message='Invalid OTP. Please try again.' />}
                </div>
                <Button title='Send' type='submit' />
            </form>
        </>
    );
};

export default LoginWithotp;

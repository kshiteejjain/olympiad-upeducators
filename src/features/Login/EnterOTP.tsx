import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmail } from "../SendEmail/SendEmail";
import Button from '../../components/Buttons/Button';
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Loader from "../../components/Loader/Loader";
import LoginAnimation from "./LoginAnimation";

import './Login.css';
import { sendWhatsappMessageOTP } from "../SendWhatsappMessage/SendWhatsappMessage";

const EnterOTP = () => {
    const [otp, setOtp] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const navigate = useNavigate();
    const generateOTP = Math.floor(Math.random() * 1000000).toString();
    const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
    const isPhoneOTP = olympdPrefix?.isPhoneOTP;

    useEffect(() => {
        const olympdPrefix = localStorage.getItem('olympd_prefix');
        if (olympdPrefix) {
            try {
                const olympdData = JSON.parse(olympdPrefix);
                if (olympdData.sessionId) {
                    navigate('/AboutOlympiad');
                }
            } catch (error) {
                console.error('Failed to parse localStorage data:', error);
            }
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoader(true);

        const olympd_prefix = localStorage.getItem('olympd_prefix');
        if (olympd_prefix) {
            const user = JSON.parse(olympd_prefix);
            const code = user?.code;
            if (code === otp) {
                delete user.code;
                localStorage.setItem('olympd_prefix', JSON.stringify(user));
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

    const handleResendOTP = async () => {
        const olympd_prefix = localStorage.getItem('olympd_prefix');
        if (olympd_prefix) {
            const user = JSON.parse(olympd_prefix);
            const email = user?.email; // Assuming email is stored here
            if (email) {
                await sendEmail(
                    email,
                    import.meta.env.VITE_OLYMPIAD_EMAIL_TEMPLATE,
                    { generateOTP }
                );
                alert('Passcode sent, Please check your email');
            } else {
                alert('No email found. Please check your details.');
            }
        }
    };

    const handleResendOTPPhone = async () => {
        const olympd_prefix = localStorage.getItem('olympd_prefix');
        if (olympd_prefix) {
            const user = JSON.parse(olympd_prefix);
            const phone = user?.phone; // Assuming email is stored here
            const var1 = generateOTP;  
            if (phone) {
                await sendWhatsappMessageOTP(phone, var1);
                alert('Passcode sent, Please check your whatsApp');
            } else {
                alert('No email found. Please check your details.');
            }
        }
    };

    const handleBackToLogin = () => {
        navigate('/');
        localStorage.removeItem('olympd_prefix')
    }


    return (
        <><div className="login-wrapper">
            <div className="login-visual"></div>
            <div className="login-form">
                <LoginAnimation isCarousal />
                {isLoader && <Loader title='Loading..' />}
                <form onSubmit={handleSubmit}>
                    <h1>Verify Passcode (check your  {`${isPhoneOTP ? 'whatsApp' : 'email'}`})</h1>
                    <div className='form-group'>
                        <label htmlFor='otp'>Enter Passcode<span className="asterisk">*</span></label>
                        <input
                            type='tel'
                            className='form-control'
                            required
                            name='otp'
                            autoComplete='off'
                            value={otp}
                            onChange={handleOtpChange}
                            maxLength={10}
                            autoFocus
                        />
                        {isError && <ErrorBoundary message='Invalid OTP. Please try again.' />}
                        <p className='input-note'>Note: Enter passcode received on your {`${isPhoneOTP ? 'whatsApp.' : 'email. ,  if not check spam.'}`}</p>
                    </div>
                    <Button title='Verify' type='submit' />
                </form>
                <div className="flex">
                    <span className="login-option" onClick={isPhoneOTP ? handleResendOTPPhone : handleResendOTP}>Resend Passcode?</span>
                    <span className="login-option" onClick={handleBackToLogin}>Back to login?</span>
                </div>
            </div>
        </div>
        </>
    );
};

export default EnterOTP;

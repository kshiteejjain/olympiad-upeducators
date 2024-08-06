import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestore } from "../../utils/firebase";
import Button from '../../components/Buttons/Button';
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Loader from "../../components/Loader/Loader";
import LoginAnimation from "./LoginAnimation";

import './Login.css';

const EnterOTP = () => {
    const [otp, setOtp] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const [oldEmail, setOldEmail] = useState<string | null>(null);
    const [newEmail, setNewEmail] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Extract URL parameters
        const params = new URLSearchParams(location.search);
        const old = params.get('old');
        const newEmailParam = params.get('new');

        if (old && newEmailParam) {
            setOldEmail(old);
            setNewEmail(newEmailParam);
        } else {
            console.log('One or both parameters are missing');
        }
    }, [location.search]);


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
                if (oldEmail && newEmail) {
                    try {
                        // Check if old email exists in the Firestore collection
                        const collectionRef = collection(firestore, 'OlympiadUsers');
                        const q = query(collectionRef, where('email', '==', oldEmail));
                        const querySnapshot = await getDocs(q);
    
                        if (!querySnapshot.empty) {
                            // Old email exists, perform update
                            const docRef = doc(collectionRef, querySnapshot.docs[0].id);
                            await updateDoc(docRef, { email: newEmail });
                            navigate('/');
                        } else {
                            setIsError(true);
                            console.log('Old email not found in Firestore');
                        }
                    } catch (error) {
                        setIsError(true);
                        console.error('Error updating Firestore:', error);
                    }
                }
    
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
                        <p className='input-note'>Note: Enter OTP received on your email or phone.</p>
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

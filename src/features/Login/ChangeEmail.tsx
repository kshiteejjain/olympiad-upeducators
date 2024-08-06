import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import { sendEmail } from "../SendEmail/SendEmail";
import Button from '../../components/Buttons/Button';
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Loader from "../../components/Loader/Loader";
import LoginAnimation from "./LoginAnimation";

import './Login.css';

const ChangeEmail = () => {
    const [userDetails, setUserDetails] = useState({
        oldEmail: '',
        newEmail: ''
    });
    const [isError, setIsError] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const navigate = useNavigate();
    const generateOTP = Math.floor(Math.random() * 1000000).toString();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setIsLoader(true);
            const oldEmail = userDetails.oldEmail.toLowerCase();
            const newEmail = userDetails.newEmail.toLowerCase();

            // Check if the old email exists
            const collectionRef = collection(firestore, 'OlympiadUsers');
            const q = query(collectionRef, where('email', '==', oldEmail));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                // Old email does not exist
                setIsLoader(false);
                setIsError(true);
            } else {
                const userDoc = querySnapshot.docs[0]; // Assuming there's only one document
                const userData = userDoc.data();
                const userName = userData.name || 'No Name'; // Adjust according to your schema
                // Update localStorage with new email
                const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
                olympdPrefix.name = userName;
                olympdPrefix.email = newEmail;
                localStorage.setItem('olympd_prefix', JSON.stringify(olympdPrefix));

                navigate(`/EnterOTP?old=${oldEmail}&new=${newEmail}`);

                // Send email
                setUserDetails({
                    oldEmail: '',
                    newEmail: ''
                });
                await sendEmail(
                    newEmail,
                    import.meta.env.VITE_OLYMPIAD_EMAIL_TEMPLATE,
                    { generateOTP }
                );
                setIsLoader(false);
            }
        } catch (error) {
            alert('Error processing request: ' + error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
        setIsError(false);
    };

    return (
        <div className="login-wrapper">
            <div className="login-visual"></div>
            <div className="login-form">
                <LoginAnimation />
                {isLoader && <Loader title={'Loading..'} />}
                <form onSubmit={handleSubmit}>
                    <h1>Change Email</h1>
                    <div className='form-group'>
                        <label htmlFor='oldEmail'>Old Email<span className="asterisk">*</span></label>
                        <input
                            type='email'
                            className='form-control'
                            required
                            name="oldEmail"
                            autoFocus
                            autoComplete="off"
                            value={userDetails.oldEmail}
                            onChange={handleInputChange}
                        />
                        {isError && <ErrorBoundary message={'Please enter a registered email.'} />}
                    </div>
                    <div className='form-group'>
                        <label htmlFor='newEmail'>New Email<span className="asterisk">*</span></label>
                        <input
                            type='email'
                            className='form-control'
                            required
                            name="newEmail"
                            autoComplete="off"
                            value={userDetails.newEmail}
                            onChange={handleInputChange}
                        />
                        <p className="input-note">Note: You will get OTP on new email. </p>
                    </div>
                    <Button title='Change Email' type='submit' />
                </form>
                <span className="login-option" onClick={()=> navigate('/')}>Back to login?</span>
            </div>
        </div>
    );
};

export default ChangeEmail;

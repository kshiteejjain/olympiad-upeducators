import { useState, useId } from "react";
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import Button from '../../components/Buttons/Button';

import './Login.css';
import SendWhatsappMessage from "../SendWhatsappMessage/SendWhatsappMessage";

const Login = () => {
    const [userDetails, setUserDetails] = useState({
        email: '',
        phone: ''
    });
    const [showPhoneInput, setShowPhoneInput] = useState(false);
    const userUid = useId()
    const uploadDataToFirestore = async (e: any) => {
        e.preventDefault();
        try {
            // Determine the login field and value
            const field = showPhoneInput ? 'phone' : 'email';
            const value = showPhoneInput ? userDetails.phone : userDetails.email.toLowerCase();

            // Check if the user exists with either email or phone
            const collectionRef = collection(firestore, 'OlympiadUsers');
            const q = query(collectionRef, where(field, '==', value));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (doc) => {
                    const data = doc.data();
                    const remainCredits = data?.remain_credits;
                    const isActiveUser = data?.isActiveUser;
                    localStorage.setItem("isLoggedIn", String(true));
                    localStorage.setItem("username", data?.email);

                    // Redirect based on user status
                    if (remainCredits <= 0 || isActiveUser === false) {
                        //navigate("/ContactUs");
                    } else {
                        const onboardingUserSnapshot = await getDocs(
                            query(collection(firestore, 'OnboardingQuestions'), where('email', '==', userDetails.email.toLowerCase()))
                        );
                        if (!onboardingUserSnapshot.empty) {
                            //navigate("/Categories");
                        } else {
                            //navigate("/OnBoardingQuestions");
                        }
                    }
                });
            } else {
                // Create a new user document
                const uid = userUid;
                const userDocId = showPhoneInput ? userDetails.phone : userDetails.email.toLowerCase();
                await setDoc(doc(firestore, 'OlympiadUsers', userDocId), {
                    email: userDetails.email.toLowerCase(),
                    phone: userDetails.phone,
                    registrationTimestamp: new Date().toISOString(), // Store the current timestamp
                    uid: uid // Store the generated UID
                });
                // Redirect to onboarding
                //navigate("/OnBoardingQuestions");
            }
        } catch (error) {
            console.log('Error querying data from Firestore: ' + error);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-visual"></div>
            <div className="login-form">
                <h1>Login to Olympiad</h1>
                <form onSubmit={uploadDataToFirestore}>
                    {!showPhoneInput ? (
                        <div className='form-group'>
                            <label htmlFor='email'>Email</label>
                            <input
                                type='email'
                                className='form-control'
                                required
                                name="email"
                                autoFocus
                                value={userDetails.email}
                                onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                            />
                        </div>
                    ) : (
                        <div className='form-group'>
                            <label htmlFor='phone'>Phone</label>
                            <input
                                type='tel'
                                className='form-control'
                                required
                                name="phone"
                                value={userDetails.phone}
                                onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                            />
                        </div>
                    )}
                    <div onClick={() => setShowPhoneInput(!showPhoneInput)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                        {showPhoneInput ? 'Login via email' : 'Login via mobile number'}
                    </div>
                    <Button title='Submit' type='submit' />
                </form>
                <SendWhatsappMessage />
            </div>
        </div>
    );
};

export default Login;

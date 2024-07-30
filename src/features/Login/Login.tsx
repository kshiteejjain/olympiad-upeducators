import { useState } from "react";
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import Button from '../../components/Buttons/Button';

import './Login.css';

const Login = () => {
    const [userDetails, setUserDetails] = useState({
        email: '',
        phone: ''
    });
    const [showPhoneInput, setShowPhoneInput] = useState(false);

    const uploadDataToFirestore = async (e: any) => {
        e.preventDefault();
        try {
            const collectionRef = collection(firestore, 'OlympiadUsers');
            const q = query(
                collectionRef,
                where('email', '==', userDetails?.email.toLowerCase()),
                where('phone', '==', userDetails?.phone)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (doc) => {
                    const data = doc.data();
                    const remainCredits = data?.remain_credits;
                    const isActiveUser = data?.isActiveUser;
                    localStorage.setItem("isLoggedIn", String(true));
                    localStorage.setItem("username", data?.email);
                    if (remainCredits <= 0 || isActiveUser === false) {
                        navigate("/ContactUs");
                    } else {
                        const onboardingUserSnapshot = await getDocs(
                            query(collection(firestore, 'OnboardingQuestions'), where('email', '==', userDetails?.email))
                        );
                        if (!onboardingUserSnapshot.empty) {
                            navigate("/Categories");
                        } else {
                            navigate("/OnBoardingQuestions");
                        }
                    }
                });
            } else {
                alert('You have entered wrong username and phone');
            }
            // Store the user's information in OlympiadUsers collection
            const userDocId = showPhoneInput ? userDetails.phone : userDetails.email.toLowerCase();
            await setDoc(doc(firestore, 'OlympiadUsers', userDocId), {
                email: userDetails.email.toLowerCase(),
                phone: userDetails.phone
            });
        } catch (error) {
            alert('Error querying data from Firestore: ' + error);
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
                                autoComplete="off"
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
            </div>
        </div>
    );
};

export default Login;

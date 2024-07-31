import { useState, useId } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import Button from '../../components/Buttons/Button';
import { sendEmail } from "../SendEmail/SendEmail";

import './Login.css';


const LoginWithEmail = () => {
    const [userDetails, setUserDetails] = useState({
        email: ''
    });
    const navigate = useNavigate();
    const userUid = useId();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const email = userDetails.email.toLowerCase();

            // Check if the user exists
            const collectionRef = collection(firestore, 'OlympiadUsers');
            const q = query(collectionRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                // Create a new user document
                await setDoc(doc(firestore, 'OlympiadUsers', email), {
                    email: email,
                    timeStamp: new Date().toISOString(),
                    uid: userUid
                });

                // Clear the form fields
                setUserDetails({
                    email: ''
                });

                // Send email
                await sendEmail(email);
                
            } else {
                alert('User already exists');
            }
        } catch (error) {
            alert('Error querying data from Firestore: ' + error);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-visual"></div>
            <div className="login-form">
                <h1>Login to Olympiad</h1>
                <form onSubmit={handleSubmit}>
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
                    <Button title='Submit' type='submit' />
                </form>
                <span onClick={()=> navigate('/LoginWithPhone')}>Login With Phone</span>
            </div>
        </div>
    );
};

export default LoginWithEmail;

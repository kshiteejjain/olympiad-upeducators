import { useState, useId } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import Button from '../../components/Buttons/Button';
import { sendWhatsappMessage } from "../SendWhatsappMessage/SendWhatsappMessage";

import './Login.css';

const LoginWithPhone = () => {
    const [userDetails, setUserDetails] = useState({
        phone: ''
    });
    const userUid = useId();
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const phone = userDetails.phone;

            // Check if the user exists
            const collectionRef = collection(firestore, 'OlympiadUsers');
            const q = query(collectionRef, where('phone', '==', phone));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                // Create a new user document
                await setDoc(doc(firestore, 'OlympiadUsers', phone), {
                    phone: phone,
                    timeStamp: new Date().toISOString(),
                    uid: userUid
                });

                // Clear the form fields
                setUserDetails({
                    phone: ''
                });

                // Send WhatsApp message
                await sendWhatsappMessage(phone);
                
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
                    <Button title='Submit' type='submit' />
                </form>
                <span onClick={() => navigate('/')}>Login With Email</span>
            </div>
        </div>
    );
};

export default LoginWithPhone;

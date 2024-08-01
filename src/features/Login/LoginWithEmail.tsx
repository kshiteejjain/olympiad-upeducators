import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import Button from '../../components/Buttons/Button';
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Loader from "../../components/Loader/Loader";
import { sendEmail } from "../SendEmail/SendEmail";

const LoginWithEmail = () => {
    const [userDetails, setUserDetails] = useState({
        email: ''
    });
    const [isError, setIsError] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setIsLoader(true)
            const email = userDetails.email.toLowerCase();

            // Check if the user exists
            const collectionRef = collection(firestore, 'OlympiadUsers');
            const q = query(collectionRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                // Email does not exist
                setIsLoader(false)
                setIsError(true)
            } else {
                // Send email
                setUserDetails({
                    email: ''
                });
                await sendEmail(email);
                setIsLoader(false)
                window.location.reload();
            }
        } catch (error) {
            alert('Error querying data from Firestore: ' + error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserDetails({ email: e.target.value });
        setIsError(false);
    };

    return (
        <>
            {isLoader && <Loader title={'Loading..'} />}
                <h1>Enter Email</h1>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            className='form-control'
                            required
                            name="email"
                            autoFocus
                            autoComplete="off"
                            value={userDetails.email}
                            onChange={handleInputChange}
                        />
                        <p className="input-note">Note: You will get notification on email. </p>
                        {isError && <ErrorBoundary message={'Please enter registered email.'} />}
                    </div>
                    <Button title='Send' type='submit' />
                </form>
        </>
    );
};

export default LoginWithEmail;

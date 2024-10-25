import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import { sendEmail } from "../SendEmail/SendEmail";
import Button from '../../components/Buttons/Button';
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Loader from "../../components/Loader/Loader";

const LoginWithEmail = () => {
    const [userDetails, setUserDetails] = useState({
        email: ''
    });
    const [isError, setIsError] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const navigate = useNavigate();
    const generateOTP = Math.floor(Math.random() * 1000000).toString();

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
                const userDoc = querySnapshot.docs[0]; // Assuming there's only one document
                const userData = userDoc.data();
                const userName = userData.name || 'No Name'; // Adjust according to your schema
                const email = userData.email || 'No Email'; // Adjust according to your schema
                const phone = userData.phone || 'No Phone'; // Adjust according to your schema
                const image = userData?.profile?.image; // Adjust according to your schema
                const olympiad = userData?.olympiad.map((item: any) => item.toLowerCase());
                const olympiadName = userData?.olympiad[0];

                // Update localStorage with user details
                const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
                olympdPrefix.name = userName;
                olympdPrefix.email = email;
                olympdPrefix.phone = phone;
                olympdPrefix.image = image;
                olympdPrefix.olympiad = olympiad;
                olympdPrefix.olympiadName = olympiadName
                localStorage.setItem('olympd_prefix', JSON.stringify(olympdPrefix));
                navigate('/EnterOTP');
                // Send email
                setUserDetails({
                    email: ''
                });
                await sendEmail(
                    email,
                    import.meta.env.VITE_OLYMPIAD_EMAIL_TEMPLATE,
                    { generateOTP }
                );
                setIsLoader(false)
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
            <form onSubmit={handleSubmit}>
                <h1>Enter Email</h1>
                <div className='form-group'>
                    <label htmlFor='email'>Email<span className="asterisk">*</span></label>
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
                    {isError && <ErrorBoundary message={'Please enter registered email.'} />}
                    <p className="input-note">Note: You will get notifications on email. </p>
                </div>
                <Button title='Send' type='submit' />
            </form>
        </>
    );
};

export default LoginWithEmail;

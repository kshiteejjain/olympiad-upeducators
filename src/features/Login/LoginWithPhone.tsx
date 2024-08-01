import { useState } from "react";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import Button from '../../components/Buttons/Button';
import { sendWhatsappMessage } from "../SendWhatsappMessage/SendWhatsappMessage";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Loader from "../../components/Loader/Loader";
import whatsappSvg from "../../assets/whatsappSvg.svg";

const LoginWithPhone = () => {
    const [userDetails, setUserDetails] = useState({
        phone: ''
    });
    const [isError, setIsError] = useState(false);
    const [isLoader, setIsLoader] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setIsLoader(true)
            const phone = userDetails.phone;    
            // Check if the user exists
            const collectionRef = collection(firestore, 'OlympiadUsers');
            const q = query(collectionRef, where('phone', '==', phone));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                // User does not exist
                setIsError(true)
                setIsLoader(false)
            } else {
                // User exists
                await sendWhatsappMessage(phone);
                setIsLoader(false)
                setUserDetails({
                    phone: ''
                });
            }
        } catch (error) {
            alert('Error querying data from Firestore: ' + error);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replace(/\D/g, '').slice(0, 10);
        setUserDetails({ phone: newValue });
        setIsError(false); 
    };
    
    return (
        <>
            {isLoader && <Loader title={'Loading..'} />}
                <h1>Enter Phone Number</h1>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='phone'>Phone</label>
                        <input
                            type='tel'
                            className='form-control'
                            required
                            name="phone"
                            autoComplete="off"
                            value={userDetails.phone}
                            onChange={handlePhoneChange}
                            pattern="[0-9]{10}"
                            maxLength={10}     
                        />
                        <p className="input-note">Note: You will get notification on <img src={whatsappSvg} /> </p>
                        {isError && <ErrorBoundary message={'Please enter registered mobile number.'} />}
                    </div>
                    <Button title='Send' type='submit' />
                </form>
        </>
    );
};

export default LoginWithPhone;

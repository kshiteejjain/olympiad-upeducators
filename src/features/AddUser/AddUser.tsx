import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import Button from '../../components/Buttons/Button';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import Loader from '../../components/Loader/Loader';

const AddUser = () => {
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        paymentId: 'internal',
        isNewUser: true,
    });
    const [isError, setIsError] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { name, email, phone, paymentId } = userDetails;

        // Validation for required fields
        if (!name || !email || !phone) {
            setIsError(true);
            return;
        }

        try {
            setIsLoader(true);
            // Prepare data for Firestore
            const phoneWithCountryCode = `91${phone}`;
            const userDocRef = doc(firestore, 'OlympiadUsers', email.toLowerCase());
            await setDoc(userDocRef, {
                name,
                email: email.toLowerCase(),
                phone: phoneWithCountryCode,
                paymentDetails: {
                    razorpay_payment_id: paymentId,
                },
                registeredDate: new Date().toISOString(),
                isNewUser: true
            });
            // Reset form and navigate
            setUserDetails({
                name: '',
                email: '',
                phone: '',
                paymentId: 'internal',
                isNewUser: true,
            });
            navigate('/EnterOTP');
        } catch (error: any) {
            alert('Error saving data to Firestore: ' + error.message);
        } finally {
            setIsLoader(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserDetails(prev => ({
            ...prev,
            [name]: value,
        }));
        setIsError(false);
    };

    return (
        <>
            {isLoader && <Loader title='Loading..' />}
            <div className='content'>
                <h2>Add User</h2>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='name'>Name<span className="asterisk">*</span></label>
                        <input
                            type='text'
                            className='form-control'
                            required
                            name='name'
                            value={userDetails.name}
                            onChange={handleInputChange}
                            autoComplete='off'
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='email'>Email<span className="asterisk">*</span></label>
                        <input
                            type='email'
                            className='form-control'
                            required
                            name='email'
                            value={userDetails.email}
                            onChange={handleInputChange}
                            autoComplete='off'
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='phone'>Phone<span className="asterisk">*</span></label>
                        <input
                            type='text'
                            className='form-control'
                            required
                            name='phone'
                            value={userDetails.phone}
                            onChange={handleInputChange}
                            maxLength={10}
                            pattern="\d{10}"
                            title="Phone number must be 10 digits"
                            autoComplete='off'
                        />
                    </div>
                    {isError && <ErrorBoundary message='All fields are required.' />}
                    <Button title='Submit' type='submit' />
                </form>
            </div>
        </>
    );
};

export default AddUser;

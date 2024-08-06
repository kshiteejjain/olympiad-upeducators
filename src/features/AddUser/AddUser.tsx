import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import Button from '../../components/Buttons/Button';
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Loader from "../../components/Loader/Loader";

const AddUser = () => {
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        mobile: '',
        whatsapp: '',
        paymentId: '',
        isNewUser: true,
    });
    const [isError, setIsError] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { name, email, mobile, whatsapp, paymentId } = userDetails;

        // Validation for required fields
        if (!name || !email || !mobile || !whatsapp) {
            setIsError(true);
            return;
        }

        try {
            setIsLoader(true);
            // Prepare data for Firestore
            const mobileWithCountryCode = `91${mobile}`;
            await addDoc(collection(firestore, 'OlympiadUsers'), {
                name,
                email: email.toLowerCase(),
                mobile: mobileWithCountryCode,
                whatsapp,
                paymentDetails: {
                    razorpay_payment_id: paymentId
                },
                registeredDate: new Date().toISOString()
            });

            // Reset form and navigate
            setUserDetails({
                name: '',
                email: '',
                mobile: '',
                whatsapp: '',
                paymentId: ''
            });
            navigate('/EnterOTP');
        } catch (error) {
            alert('Error saving data to Firestore: ' + error);
        } finally {
            setIsLoader(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserDetails(prev => ({
            ...prev,
            [name]: value
        }));
        setIsError(false);
    };

    return (
        <>
            {isLoader && <Loader title='Loading..' />}
            <form onSubmit={handleSubmit}>
                <h1>Enter User Details</h1>
                <div className='form-group'>
                    <label htmlFor='name'>Name<span className="asterisk">*</span></label>
                    <input
                        type='text'
                        className='form-control'
                        required
                        name='name'
                        value={userDetails.name}
                        onChange={handleInputChange}
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
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='mobile'>Mobile<span className="asterisk">*</span></label>
                    <input
                        type='text'
                        className='form-control'
                        required
                        name='mobile'
                        value={userDetails.mobile}
                        onChange={handleInputChange}
                        maxLength={10}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='whatsapp'>WhatsApp<span className="asterisk">*</span></label>
                    <input
                        type='text'
                        className='form-control'
                        required
                        name='whatsapp'
                        value={userDetails.whatsapp}
                        onChange={handleInputChange}
                        maxLength={10}
                    />
                </div>
                {isError && <ErrorBoundary message='All fields are required.' />}
                <Button title='Submit' type='submit' />
            </form>
        </>
    );
};

export default AddUser;

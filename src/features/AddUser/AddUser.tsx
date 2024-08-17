import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import { sendEmail } from '../SendEmail/SendEmail';
import { sendWhatsappMessage } from '../SendWhatsappMessage/SendWhatsappMessage';
import Button from '../../components/Buttons/Button';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import Loader from '../../components/Loader/Loader';

const AddUser = () => {
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        paymentId: 'internal',
        source: 'internal',
        olympiad: [] as string[] // Initialize as an empty array
    });
    const [validationError, setValidationError] = useState(false);
    const [emailExistsError, setEmailExistsError] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { name, email, phone, paymentId, olympiad, source } = userDetails;

        if (!name || !email || !phone || olympiad.length === 0) {
            setValidationError(true);
            return;
        }

        try {
            setIsLoader(true);
            const emailLowerCase = email.toLowerCase();
            const userDocRef = doc(firestore, 'OlympiadUsers', emailLowerCase);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                setEmailExistsError(true);
                return;
            }

            await setDoc(userDocRef, {
                name,
                email: emailLowerCase,
                phone,
                paymentDetails: { razorpay_payment_id: paymentId },
                timeStamp: new Date().toISOString(),
                isNewUser: true,
                olympiad,
                source
            });

            await sendEmail(
                emailLowerCase,
                import.meta.env.VITE_OLYMPIAD_WELCOME_EMAIL_TEMPLATE,
                { name, email: emailLowerCase, phone }
            );
            await sendWhatsappMessage(phone);

            setUserDetails({
                name: '',
                email: '',
                phone: '',
                paymentId: 'internal',
                olympiad: [] // Reset to empty array
            });
            alert('User Registered. An Email and WhatsApp message have been sent to the user.');
            navigate('/Admin');
        } catch (error: any) {
            alert('Error saving data to Firestore: ' + error.message);
        } finally {
            setIsLoader(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'olympiad') {
            const newOlympiad = value.split(',').map(olympiad => olympiad.trim()).filter(olympiad => olympiad !== '');
            setUserDetails(prev => ({
                ...prev,
                [name]: newOlympiad
            }));
        } else {
            setUserDetails(prev => ({
                ...prev,
                [name]: value
            }));
        }
        setValidationError(false);
        setEmailExistsError(false);
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
                        {emailExistsError && <ErrorBoundary message='This email is already registered.' />}
                    </div>
                    <div className='form-group'>
                        <label htmlFor='phone'>Phone<span className="asterisk">*</span></label>
                        <input
                            type='text'
                            className='form-control phone'
                            required
                            name='phone'
                            value={userDetails.phone}
                            onChange={handleInputChange}
                            maxLength={10}
                            pattern="\d{10}"
                            autoComplete='off'
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='olympiad'>Olympiad Name<span className="asterisk">*</span></label>
                        <input
                            type='text'
                            className='form-control'
                            required
                            name='olympiad'
                            value={userDetails.olympiad.join(', ')} // Join array into a string for display
                            onChange={handleInputChange}
                            autoComplete='off'
                        />
                    </div>
                    {validationError && <ErrorBoundary message='All fields are required.' />}
                    <Button title='Submit' type='submit' />
                    <Button title='Go Back' type='button' isSecondary onClick={() => navigate('/Admin')} />
                </form>
            </div>
        </>
    );
};

export default AddUser;

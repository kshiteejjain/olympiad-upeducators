import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import { sendEmail } from '../SendEmail/SendEmail';
import { sendWhatsappMessage } from '../SendWhatsappMessage/SendWhatsappMessage';
import Button from '../../components/Buttons/Button';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import Loader from '../../components/Loader/Loader';


type UserDetails = {
    email: string;
    isNewUser: boolean; // Ensure isNewUser is included
    name: string;
    olympiad: string[];
    paymentDetails: {
        razorpay_payment_id: string;
    };
    phone: string;
    paymentId: string;
    source: string;
};


const AddUser: React.FC = () => {
    const [userDetails, setUserDetails] = useState<UserDetails>({
        name: '',
        email: '',
        phone: '',
        paymentId: 'internal',
        source: 'internal',
        olympiad: [], // Initialize as an empty array
        isNewUser: true, // Provide default value
        paymentDetails: { razorpay_payment_id: 'internal' } // Initialize paymentDetails properly
    });
    const [validationError, setValidationError] = useState<boolean>(false);
    const [emailExistsError, setEmailExistsError] = useState<boolean>(false);
    const [isLoader, setIsLoader] = useState<boolean>(false);
    const [csvLoader, setCsvLoader] = useState<boolean>(false);
    const [uploadData, setUploadData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
                source: 'internal',
                olympiad: [], // Reset to empty array
                isNewUser: true, // Include isNewUser
                paymentDetails: { razorpay_payment_id: 'internal' } // Include paymentDetails
            });
            alert('User Registered. An Email and WhatsApp message have been sent to the user.');
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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCsvLoader(true);
        setError(null);

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (!jsonData || jsonData.length === 0) {
                throw new Error('No data found in the Excel file.');
            }

            // Skip header row
            jsonData.shift();
            setUploadData(jsonData);
        } catch (err) {
            console.error('Error processing file:', err);
            setError('Error processing file: ' + (err as Error).message);
        } finally {
            setCsvLoader(false);
        }
    };

    const handleUpload = async () => {
        setCsvLoader(true);
        setError(null);

        try {
            for (const row of uploadData) {
                const [email, name, olympiad, phone] = row;
                const emailLowerCase = email?.toString().toLowerCase();
                if (!emailLowerCase) continue;

                const userDocRef = doc(firestore, 'OlympiadUsers', emailLowerCase);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    console.warn(`User with email ${emailLowerCase} already exists.`);
                    continue;
                }

                await setDoc(userDocRef, {
                    name: name?.toString() || '',
                    email: emailLowerCase,
                    phone: phone?.toString() || '',
                    paymentDetails: { razorpay_payment_id: 'internal' },
                    timeStamp: new Date().toISOString(),
                    isNewUser: true,
                    olympiad: olympiad?.toString().split(',').map((item:any) => item.trim()) || [],
                    source: 'internal'
                });
                await sendEmail(
                    emailLowerCase,
                    import.meta.env.VITE_OLYMPIAD_WELCOME_EMAIL_TEMPLATE,
                    { name, email: emailLowerCase, phone }
                );
                await sendWhatsappMessage(phone);
            }

            alert('User Registered. An Email and WhatsApp message have been sent to the user.');
            setUploadData([]);
        } catch (err) {
            console.error('Error uploading data:', err);
            setError('Error uploading data: ' + (err as Error).message);
        } finally {
            setCsvLoader(false);
        }
    };

    return (
        <>
            {isLoader && <Loader title='Loading..' />}
            {csvLoader && <Loader title='Processing file..' />}
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
                <div className='csv-upload'>
                    <h2>Bulk Upload CSV</h2>
                    <div className='form-group'>
                        <label htmlFor='csvUpload'>Select File<span className="asterisk">*</span></label>
                        <input
                            type='file'
                            accept='.csv'
                            className='form-control'
                            onChange={handleFileUpload}
                        />
                    </div>
                    {error && <div className='error-message'>{error}</div>}
                    {uploadData.length > 0 && (
                        <Button title='Upload Data' type='button' onClick={handleUpload} />
                    )}
                </div>
            </div>
        </>
    );
};

export default AddUser;

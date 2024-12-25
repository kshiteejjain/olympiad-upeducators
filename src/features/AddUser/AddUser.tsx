import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import { sendEmail } from '../SendEmail/SendEmail';
// import { sendWhatsappMessage } from '../SendWhatsappMessage/SendWhatsappMessage';
import Button from '../../components/Buttons/Button';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import Loader from '../../components/Loader/Loader';

type UserDetails = {
    email: string;
    isNewUser: boolean;
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
        olympiad: [],
        isNewUser: true,
        paymentDetails: { razorpay_payment_id: 'internal' }
    });
    const [validationError, setValidationError] = useState<boolean>(false);
    const [emailExistsError, setEmailExistsError] = useState<boolean>(false);
    const [isLoader, setIsLoader] = useState<boolean>(false);
    const [csvLoader, setCsvLoader] = useState<boolean>(false);
    const [uploadData, setUploadData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [fetchedCount, setFetchedCount] = useState<number>(0);
    const [successfulCount, setSuccessfulCount] = useState<number>(0);
    const [failedCount, setFailedCount] = useState<number>(0);
    const [existingEmails, setExistingEmails] = useState<string[]>([]);
    const [failedEmails, setFailedEmails] = useState<string[]>([]);
    const [uploadSummary, setUploadSummary] = useState<string | null>(null);
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
                isNewUser: false,
                olympiad,
                source
            });

            await sendEmail(
                emailLowerCase,
                import.meta.env.VITE_OLYMPIAD_WELCOME_EMAIL_TEMPLATE,
                { name, email: emailLowerCase, phone }
            );
            // const olympiadLabel = olympiad.map((item) => {
            //     switch (item) {
            //         case 'e24':
            //             return 'English 2025';
            //         case 'm24':
            //             return 'Maths 2024';
            //         case 'p25':
            //             return 'Primary 2025';
            //         case 'e25_2':
            //             return 'English 2025 - 2';
            //         case 'm24_2':
            //             return 'Maths 2024 - 2';
            //         case 'p25_2':
            //             return 'Primary 2025 - 2';
            //         default:
            //             return item; // Default to the olympiad ID if no match is found
            //     }
            // }).join(', ');

            // const var1 = name;      // Name
            // const var2 = olympiadLabel;     // Olympiad Name
            // const var3 = emailLowerCase; // Email
            // const var4 = olympiadDate;
            // await sendWhatsappMessage(phone, var1, var2, var3, var4);

            setUserDetails({
                name: '',
                email: '',
                phone: '',
                paymentId: 'internal',
                source: 'internal',
                olympiad: [],
                isNewUser: false,
                paymentDetails: { razorpay_payment_id: 'internal' }
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
        setFetchedCount(0);
        setSuccessfulCount(0);
        setFailedCount(0);
        setExistingEmails([]);
        setFailedEmails([]);

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
            setFetchedCount(jsonData.length); // Set the number of fetched records
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
                    setExistingEmails(prev => [...prev, emailLowerCase]);
                    setFailedCount(prev => prev + 1);
                    continue;
                }

                try {
                    await setDoc(userDocRef, {
                        name: name?.toString() || '',
                        email: emailLowerCase,
                        phone: phone?.toString() || '',
                        paymentDetails: { razorpay_payment_id: 'internal' },
                        timeStamp: new Date().toISOString(),
                        isNewUser: false,
                        olympiad: olympiad?.toString().split(',').map((item: any) => item.trim()) || [],
                        source: 'internal'
                    });
                    await sendEmail(
                        emailLowerCase,
                        import.meta.env.VITE_OLYMPIAD_WELCOME_EMAIL_TEMPLATE,
                        { name, email: emailLowerCase, phone }
                    );
                    // const olympiadLabel = olympiad.map((item: any) => {
                    //     switch (item) {
                    //         case 'e25':
                    //             return 'English 2025';
                    //         case 'm24':
                    //             return 'Maths 2024';
                    //         case 'p25':
                    //             return 'Primary 2025';
                    //         case 'e25_2':
                    //             return 'English 2025 - 2';
                    //         case 'm24_2':
                    //             return 'Maths 2024 - 2';
                    //         case 'p25_2':
                    //             return 'Primary 2025 - 2';
                    //         default:
                    //             return item; // Default to the olympiad ID if no match is found
                    //     }
                    // }).join(', ');
        
                    // const var1 = name;      // Name
                    // const var2 = olympiadLabel;     // Olympiad Name
                    // const var3 = emailLowerCase; // Email
                    // const var3 = emailLowerCase; // Email
                    // await sendWhatsappMessage(phone, var1, var2, var3, var4);
        
                    setSuccessfulCount(prev => prev + 1);
                } catch (err) {
                    console.error('Error uploading data:', err);
                    setFailedCount(prev => prev + 1);
                    setFailedEmails(prev => [...prev, emailLowerCase]);
                }
            }

            // Construct the summary message
            setUploadSummary(`
                Upload complete!
            `);
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
                            value={userDetails.olympiad.join(', ')}
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
                        <>
                            <Button title='Upload Data' type='button' onClick={handleUpload} />

                        </>
                    )}
                    {uploadSummary && <div className='upload-summary-message'>{uploadSummary}</div>}
                    <div className='upload-summary'>
                        <p>Total Records Fetched: {fetchedCount}</p>
                        <p>Records Successfully Stored: {successfulCount}</p>
                        <p>Records Failed to Store: {failedCount}</p>
                        <p>Existing Emails: {existingEmails.join(', ') || 'None'}</p>
                        <p>Failed Email IDs: {failedEmails.join(', ') || 'None'}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddUser;

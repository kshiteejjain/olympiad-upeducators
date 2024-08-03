import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../utils/firebase';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Button from '../../components/Buttons/Button';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import LoginAnimation from '../Login/LoginAnimation';
import Loader from '../../components/Loader/Loader';

import './LMSForm.css';

const countryOptions = [
    // List of country names
    "United States", "Canada", "India", "United Kingdom", "Australia", "China", "Japan", // add more countries
];
const organizationTypes = [
    "School", "College", "Coaching Class", "Private Education Institute", "Self Employed", "Other"
];
const boards = [
    "State Board", "CBSE", "ICSE", "Cambridge", "IB", "Other", "Not Applicable"
];
const roles = [
    "Teacher - Primary and Preprimary", "Teacher - Middle School", "Teacher - High School or Higher Secondary",
    "Admin", "Coaching or Education institute owner", "Private Tutor/Trainer", "Professor or College Teacher",
    "Principal / Vice Principal", "Freelance Trainer", "Trainee Teacher", "Other"
];
const gradeLevels = [
    "Grade 1 to 5", "Grade 6 to 10", "Grade 11 and above"
];

const LMSForm = () => {
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        mobileNumber: '',
        whatsappNumber: '',
        email: '',
        city: '',
        country: '',
        dateOfBirth: '',
        organizationType: '',
        organizationName: '',
        board: '',
        role: '',
        gradeLevel: '',
    });

    const [isError, setIsError] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const checkIfNewUser = async () => {
            try {
                setIsLoader(true);
                const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
                const { email } = olympdPrefix;
                const sessionId = localStorage.getItem('sessionId');
    
                if (sessionId) {
                    // Redirect to AboutOlympiad if sessionId is present
                    navigate('/AboutOlympiad');
                    return;
                }
    
                if (!email) {
                    alert('No logged-in email found');
                    //navigate('/');
                    return;
                }
    
                const userQuery = query(collection(firestore, 'OlympiadUsers'), where('email', '==', email));
                const querySnapshot = await getDocs(userQuery);
    
                if (querySnapshot.empty) {
                    alert('Email does not exist');
                    return;
                }
    
                const userDoc = querySnapshot.docs[0];
                const { isNewUser } = userDoc.data();
                // Redirect based on isNewUser value
                navigate(isNewUser ? '' : '/AboutOlympiad');
            } catch (error: any) {
                alert(error.message);
                setIsError(true);
            } finally {
                setIsLoader(false);
            }
        };
    
        checkIfNewUser();
    }, [navigate]);
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
            olympdPrefix.sessionId = 'z5pxv6w2chzvkjjf0y64'; // Add sessionId to user object
            localStorage.setItem('olympd_prefix', JSON.stringify(olympdPrefix)); // Update localStorage

            setIsLoader(true);
            const email = userDetails.email.toLowerCase();
            const loggedInEmail = olympdPrefix.email;

            if (loggedInEmail !== email) throw new Error('Logged-in email and entered email do not match');

            const userQuery = query(collection(firestore, 'OlympiadUsers'), where('email', '==', email));
            const querySnapshot = await getDocs(userQuery);

            if (querySnapshot.empty) throw new Error('Email does not exist');

            const userDoc = querySnapshot.docs[0];
            const userName = userDoc.data().name || 'No Name';

            olympdPrefix.name = userName;
            localStorage.setItem('olympd_prefix', JSON.stringify(olympdPrefix));

            await updateDoc(doc(firestore, 'OlympiadUsers', userDoc.id), { profile: userDetails, isNewUser: false });

            setUserDetails({
                firstName: '', lastName: '', mobileNumber: '', whatsappNumber: '', email: '',
                city: '', country: '', dateOfBirth: '', organizationType: '', organizationName: '',
                board: '', role: '', gradeLevel: '',
            });

            navigate('/AboutOlympiad');
        } catch (error:any) {
            alert(error.message);
            setIsError(true);
        } finally {
            setIsLoader(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserDetails(prevState => ({ ...prevState, [name]: value }));
        setIsError(false);
    };

    return (
        <div className="login-wrapper">
            {isLoader && <Loader title='Loading...' />}
            <div className="lms-form">
                <LoginAnimation />
                <form onSubmit={handleSubmit}>
                    <h1>Enter Your Details</h1>

                    <div className='form-group'>
                        <label htmlFor='firstName'>First Name<span className="asterisk">*</span></label>
                        <input
                            type='text'
                            className='form-control'
                            required
                            name="firstName"
                            autoComplete="off"
                            value={userDetails.firstName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='lastName'>Last Name<span className="asterisk">*</span></label>
                        <input
                            type='text'
                            className='form-control'
                            required
                            name="lastName"
                            autoComplete="off"
                            value={userDetails.lastName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='mobileNumber'>Mobile Number<span className="asterisk">*</span></label>
                        <input
                            type='tel'
                            className='form-control phone'
                            required
                            name="mobileNumber"
                            autoComplete="off"
                            value={userDetails.mobileNumber}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='whatsappNumber'>WhatsApp Number<span className="asterisk">*</span></label>
                        <input
                            type='tel'
                            className='form-control phone'
                            name="whatsappNumber"
                            autoComplete="off"
                            value={userDetails.whatsappNumber}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='email'>Email<span className="asterisk">*</span></label>
                        <input
                            type='email'
                            className='form-control'
                            required
                            name="email"
                            autoComplete="off"
                            value={userDetails.email}
                            onChange={handleInputChange}
                        />
                        {isError && <ErrorBoundary message={'Please enter the email you registered with us.'} />}
                    </div>

                    <div className='form-group'>
                        <label htmlFor='city'>City<span className="asterisk">*</span></label>
                        <input
                            type='text'
                            className='form-control'
                            required
                            name="city"
                            autoComplete="off"
                            value={userDetails.city}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='country'>Country<span className="asterisk">*</span></label>
                        <select
                            className='form-control'
                            required
                            name="country"
                            value={userDetails.country}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Country</option>
                            {countryOptions.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='dateOfBirth'>Date of Birth<span className="asterisk">*</span></label>
                        <input
                            type='date'
                            className='form-control'
                            required
                            name="dateOfBirth"
                            value={userDetails.dateOfBirth}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='organizationType'>Type of Organisation you are working in<span className="asterisk">*</span></label>
                        <select
                            className='form-control'
                            required
                            name="organizationType"
                            value={userDetails.organizationType}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Organization Type</option>
                            {organizationTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='organizationName'>Organization Name<span className="asterisk">*</span></label>
                        <input
                            type='text'
                            className='form-control'
                            required
                            name="organizationName"
                            autoComplete="off"
                            value={userDetails.organizationName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='board'>You are teaching Students of which Board?<span className="asterisk">*</span></label>
                        <select
                            className='form-control'
                            required
                            name="board"
                            value={userDetails.board}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Board</option>
                            {boards.map(board => (
                                <option key={board} value={board}>{board}</option>
                            ))}
                        </select>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='role'>Your Role<span className="asterisk">*</span></label>
                        <select
                            className='form-control'
                            required
                            name="role"
                            value={userDetails.role}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Role</option>
                            {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='gradeLevel'>Grade level you teach?<span className="asterisk">*</span></label>
                        <select
                            className='form-control'
                            required
                            name="gradeLevel"
                            value={userDetails.gradeLevel}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Grade Level</option>
                            {gradeLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>

                    <Button title='Submit' type='submit' />
                </form>
            </div>
        </div>
    );
};

export default LMSForm;

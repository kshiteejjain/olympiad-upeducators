import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../utils/firebase';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Button from '../../components/Buttons/Button';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import LoginAnimation from '../Login/LoginAnimation';
import Loader from '../../components/Loader/Loader';
import UploadProfile from './UploadProfile';
import ProfilePlaceholder from '../../assets/profile-placeholder.png';

import './LMSForm.css';

const countryOptions = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", 
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", 
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", 
    "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", 
    "Congo (Democratic Republic)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", 
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", 
    "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", 
    "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", 
    "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea (North)", "Korea (South)", 
    "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", 
    "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", 
    "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", 
    "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", 
    "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", 
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", 
    "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", 
    "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", 
    "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", 
    "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", 
    "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", 
    "Yemen", "Zambia", "Zimbabwe"
];

const organizationTypes = [
    "School", "College", "Coaching Class", "Private Education Institute", "Ed Tech", "Self Employed", "Other"
];
const boards = [
    "State Board", "CBSE", "ICSE", "Cambridge", "IB", "Other", "Not Applicable"
];
const roles = [
    "Teacher - Pre Primary", 
    "Teacher - Primary", 
    "Teacher - Middle School", 
    "Teacher - High School or Higher Secondary",
    "Admin / Coordinator", 
    "Coaching or Education institute owner", 
    "Private Tutor/Trainer", 
    "Professor or College Teacher",
    "Principal / Vice Principal", 
    "Management / Director", 
    "Freelance Trainer", 
    "Trainee Teacher", 
    "Other"
];
const gradeLevels = [
    "Pre Primary Grades", "Grade 1 to 5", "Grade 6 to 10", "Grade 11 and above"
];

const LMSForm = () => {
    const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
    const [userDetails, setUserDetails] = useState({
        name: olympdPrefix?.name,
        whatsappNumber: olympdPrefix?.phone,
        email: olympdPrefix?.email,
        city: '',
        country: '',
        dateOfBirth: '',
        organizationType: '',
        organizationName: '',
        board: '',
        role: '',
        gradeLevel: '',
        subjectTeaching: ''
    });

    const [isError, setIsError] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');
    const [profilePictureError, setProfilePictureError] = useState(false);
    const navigate = useNavigate();

    const handleImageCropped = (base64Image: any) => {
        setProfilePicture(base64Image);
        const updatedOlympdPrefix = { ...olympdPrefix, image: base64Image };
        localStorage.setItem('olympd_prefix', JSON.stringify(updatedOlympdPrefix));
    };

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
                    //alert('No logged-in email found');
                    navigate('/');
                    return;
                }

                const userQuery = query(collection(firestore, 'OlympiadUsers'), where('email', '==', email));
                const querySnapshot = await getDocs(userQuery);

                if (querySnapshot.empty) {
                    //alert('Email does not exist');
                    navigate('/');
                    return;
                }

                const userDoc = querySnapshot.docs[0];
                const { isNewUser } = userDoc.data();
                console.log('isNewUser', isNewUser)
                // Redirect based on isNewUser value
                if (isNewUser === false) {
                    const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
                    olympdPrefix.sessionId = 'z5pxv6w2chzvkjjf0y64'; // Add sessionId to user object
                    localStorage.setItem('olympd_prefix', JSON.stringify(olympdPrefix));
                    navigate('/AboutOlympiad')
                }
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
        if (!profilePicture) {
            setProfilePictureError(true);
            return;
        }
        try {
            const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
            olympdPrefix.sessionId = 'z5pxv6w2chzvkjjf0y64'; // Add sessionId to user object
            localStorage.setItem('olympd_prefix', JSON.stringify(olympdPrefix)); // Update localStorage

            setIsLoader(true);
            const email = userDetails.email.toLowerCase();
            const loggedInEmail = olympdPrefix.email.toLowerCase();

            if (loggedInEmail !== email) throw new Error('Logged-in email and entered email do not match');

            const userQuery = query(collection(firestore, 'OlympiadUsers'), where('email', '==', email));
            const querySnapshot = await getDocs(userQuery);

            if (querySnapshot.empty) throw new Error('Email does not exist');

            const userDoc = querySnapshot.docs[0];
            const userName = userDoc.data().name || 'No Name';
            olympdPrefix.name = userName;
            olympdPrefix.image = profilePicture; // Save the base64 image URL here

            localStorage.setItem('olympd_prefix', JSON.stringify(olympdPrefix));

            await updateDoc(doc(firestore, 'OlympiadUsers', userDoc.id), {
                profile: {
                    ...userDetails,
                    whatsappNumber: `${userDetails.whatsappNumber}`,
                    image: profilePicture // Save the base64 image URL here
                },
                isNewUser: false
            });

            setUserDetails({
                name: '', whatsappNumber: '', email: '',
                city: '', country: '', dateOfBirth: '', organizationType: '', organizationName: '',
                board: '', role: '', gradeLevel: '', subjectTeaching: ''
            });
            setProfilePictureError(false);
            navigate('/AboutOlympiad');
        } catch (error: any) {
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
                    <h2>Enter Your Details</h2>
                    <div className='user-profile'>
                        <div className='user-profile-left'>
                            <div className='form-group'>
                                <label htmlFor='name'>Name<span className="asterisk">*</span></label>
                                <input
                                    type='text'
                                    className='form-control'
                                    required
                                    name="name"
                                    autoComplete="off"
                                    value={userDetails.name}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='whatsappNumber'>WhatsApp Number<span className="asterisk">*</span></label>
                                <input
                                    type='tel'
                                    className='form-control phone'
                                    required
                                    name="whatsappNumber"
                                    autoComplete="off"
                                    value={userDetails.whatsappNumber}
                                    onChange={handleInputChange}
                                    maxLength={10}
                                    disabled
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
                                    disabled
                                />
                                {isError && <ErrorBoundary message={'Please enter the email you registered with us.'} />}
                            </div>
                        </div>
                        <div className='user-profile-right'>
                            <div className="form-group">
                                <label htmlFor="profilePicture">Upload Profile Picture<span className="asterisk">*</span></label>
                                <div className='user-profile-upload'>
                                    {profilePicture ? <img className='img-size' src={profilePicture} alt="Profile" /> : <img className='img-size' src={ProfilePlaceholder} alt="Profile" />}
                                    <Button title={profilePicture ? 'Change Profile Picture' : 'Upload Profile Picture'} type="button" onClick={() => setShowUploadPopup(true)} />
                                    {profilePictureError && <ErrorBoundary message='Please upload your profile picture.' />}
                                </div>
                            </div>
                        </div>
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
                    <div className='form-group'>
                        <label htmlFor='subjectTeaching'>Subjects you teach ( If not teaching, then write NA)<span className="asterisk">*</span></label>
                        <input
                            type='text'
                            className='form-control'
                            required
                            name="subjectTeaching"
                            autoComplete="off"
                            value={userDetails.subjectTeaching}
                            onChange={handleInputChange}
                        />
                    </div>
                    <Button title='Submit' type='submit' />
                    {profilePictureError && <ErrorBoundary message='Please upload your profile picture.' />}
                </form>
            </div>
            {showUploadPopup && (
                <UploadProfile
                    onClose={() => setShowUploadPopup(false)}
                    onImageCropped={handleImageCropped}
                />
            )}
        </div>
    );
};

export default LMSForm;

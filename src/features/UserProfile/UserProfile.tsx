import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../utils/firebase';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Buttons/Button';

import './UserProfile.css';

// Define types for user profile and data
type Profile = {
    name: string;
    dateOfBirth: string;
    country: string;
    organizationName: string;
    organizationType: string;
    role: string;
    gradeLevel: string;
    city: string;
    board: string;
    whatsappNumber: string;
    image: string;
};

type UserData = {
    email: string;
    profile: Profile;
    isNewUser?: boolean;
    olympiad?: any;
    name: string
};

const UserProfile = () => {
    const [data, setData] = useState<UserData | null>(null); // Use null to indicate no data
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoader, setIsLoader] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [name, setName] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        // Set initial name from data
        if (data?.name) {
            setName(data.name);
        }
    }, [data]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            if (data?.email) {
                const userRef = doc(firestore, 'OlympiadUsers', data.email);
                await updateDoc(userRef, {
                    name: name, // Update data.name
                    'profile.name': name // Update data.profile.name
                });

                // Update name in localStorage
                const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
                olympdPrefix.name = name;
                localStorage.setItem('olympd_prefix', JSON.stringify(olympdPrefix));

                setIsEditing(false);
                alert('Name updated successfully!');
                window.location.reload();
            }
        } catch (error: any) {
            alert('Error updating name: ' + error.message);
        }
    };


    useEffect(() => {
        const checkIfNewUser = async () => {
            try {
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
                    return;
                }

                const userQuery = query(collection(firestore, 'OlympiadUsers'), where('email', '==', email));
                const querySnapshot = await getDocs(userQuery);

                if (querySnapshot.empty) {
                    alert('Email does not exist');
                    localStorage.removeItem('olympd_prefix')
                    navigate('/')
                    return;
                }

                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data() as UserData; // Cast the data to UserData
                setData(userData);

            } catch (error: any) {
                alert(error.message);
                setIsError(true);
            } finally {
                setIsLoader(false);
            }
        };

        checkIfNewUser();
    }, [navigate]);

    if (isLoader) {
        return <Loader title='Loading...' />;
    }

    if (isError) {
        return <div className="error-message">An error occurred. Please try again.</div>;
    }

    return (
        <>
            {
                data ? (
                    <div className="content">
                        <h2>Profile</h2>
                        <div className='user-details'>
                            <div className='table-wrapper'>
                                <table className='table'>
                                    <tbody>
                                        <tr>
                                            <td>Email</td>
                                            <td>{data.email}</td>
                                        </tr>
                                        <tr>
                                            <td>Name</td>
                                            <td className='justify-between flex'>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                    />
                                                ) : (
                                                    data?.profile?.name
                                                )}
                                                <Button isError type='button' title={isEditing ? 'Save' : 'Edit'} onClick={isEditing ? handleSave : handleEdit} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Date of Birth</td>
                                            <td>{data?.profile?.dateOfBirth}</td>
                                        </tr>
                                        <tr>
                                            <td>Country</td>
                                            <td>{data?.profile?.country}</td>
                                        </tr>
                                        <tr>
                                            <td>Organization Name</td>
                                            <td>{data?.profile?.organizationName}</td>
                                        </tr>
                                        <tr>
                                            <td>Organization Type</td>
                                            <td>{data?.profile?.organizationType}</td>
                                        </tr>
                                        <tr>
                                            <td>Role</td>
                                            <td>{data?.profile?.role}</td>
                                        </tr>
                                        <tr>
                                            <td>Grade Level</td>
                                            <td>{data?.profile?.gradeLevel}</td>
                                        </tr>
                                        <tr>
                                            <td>City</td>
                                            <td>{data?.profile?.city}</td>
                                        </tr>
                                        <tr>
                                            <td>Board</td>
                                            <td>{data?.profile?.board}</td>
                                        </tr>
                                        <tr>
                                            <td>WhatsApp Number</td>
                                            <td>{data?.profile?.whatsappNumber}</td>
                                        </tr>
                                        <tr>
                                            <td>Registered Olympiad</td>
                                            <td>
                                                {data?.olympiad
                                                    ?.map((olymp: any) => {
                                                        const olympiadMap = {
                                                            e25: 'English 2025',
                                                            m24: 'Maths 2024',
                                                            p25: 'Primary 2025',
                                                            e25_2: 'English 2025 - 2',
                                                            m24_2: 'Maths 2024 - 2'
                                                        } as const;

                                                        return olympiadMap[olymp as keyof typeof olympiadMap] || null; // Ensure olympp is a key
                                                    })
                                                    .filter(Boolean) // Remove any null values
                                                    .join(', ')}
                                            </td>

                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className='user-details-profile'>
                                <p>Profile Image:</p>
                                <img src={data?.profile?.image} alt="User Profile" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="no-data">No user data found</div>
                )}

        </>
    );
};

export default UserProfile;

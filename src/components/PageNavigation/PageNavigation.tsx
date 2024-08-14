import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { firestore } from '../../utils/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Loader from "../Loader/Loader";

import './PageNavigation.css';

// Define types
type UserData = {
    email: string;
    olympiad?: string[];
};

const PageNavigation = () => {
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState<string | null>(null);
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    const handleClick = (path: string) => {
        setActiveButton(path);
        navigate(path);
    };

    const olympd_prefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');

    const handleOlympiadClick = (olympiad: string) => {
        console.log(`Olympiad clicked: ${olympiad}`);
        // Add logic for handling each Olympiad click
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (olympd_prefix.email) {
                    const userQuery = query(
                        collection(firestore, 'OlympiadUsers'),
                        where('email', '==', olympd_prefix?.email)
                    );
                    const querySnapshot = await getDocs(userQuery);
                    const usersData: UserData[] = querySnapshot.empty ? [] : querySnapshot.docs.map(doc => doc.data() as UserData);
                    setUsers(usersData);
                } else {
                    console.warn('No email found in olympd_prefix');
                }
            } catch (err) {
                console.error('Error fetching registered olympiad name:', err);
                alert('Error fetching registered olympiad name');
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [olympd_prefix.email]);
    

    return (
        <div className='navigation'>
            {loading && <Loader />}
            <>
            {users.flatMap(user => user.olympiad || []) // Flatten and extract Olympiad options
                    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
                    .map((olympiad, index) => {
                        // Inline logic to map Olympiad codes to labels
                        const olympiadLabel = olympiad === 's24' ? 'Science 2024'
                            : olympiad === 'm24' ? 'Maths 2024'
                            : olympiad; // Default to the code itself if no label is found
                        
                        return (
                            <button
                                key={index}
                                className={activeButton === olympiad ? 'active' : ''}
                                onClick={() => handleOlympiadClick(olympiad)}
                            >
                                {olympiadLabel}
                            </button>
                        );
                    })}
            </>
            <button
                className={activeButton === '/AboutOlympiad' ? 'active' : ''}
                onClick={() => handleClick('/AboutOlympiad')}
            >
                About this Olympiad
            </button>
            <button
                className={activeButton === '/ReferEarn' ? 'active' : ''}
                onClick={() => handleClick('/ReferEarn')}
            >
                Refer & Earn
            </button>
            <button
                className={activeButton === '/Awards' ? 'active' : ''}
                onClick={() => handleClick('/Awards')}
            >
                Awards
            </button>
            <button
                className={activeButton === '/FAQ' ? 'active' : ''}
                onClick={() => handleClick('/FAQ')}
            >
                FAQ
            </button>
            <button
                className={activeButton === '/LiveMasterclass' ? 'active' : ''}
                onClick={() => handleClick('/LiveMasterclass')}
            >
                Live Masterclass
            </button>
            <button
                className={activeButton === '/Report' ? 'active' : ''}
                onClick={() => handleClick('/Report')}
            >
                Report
            </button>
            <button
                className={activeButton === '/AboutUpEducators' ? 'active' : ''}
                onClick={() => handleClick('/AboutUpEducators')}
            >
                About upEducators
            </button>
            <button
                className={activeButton === '/CoursesForEducators' ? 'active' : ''}
                onClick={() => handleClick('/CoursesForEducators')}
            >
                Courses for Educators
            </button>
        </div>
    );
};

export default PageNavigation;

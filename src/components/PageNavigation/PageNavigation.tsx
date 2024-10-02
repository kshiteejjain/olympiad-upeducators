import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { firestore } from '../../utils/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';

import './PageNavigation.css';

const PageNavigation = ({ navPath }: any) => {
    const [activeButton, setActiveButton] = useState<string | null>(null);
    const [showStartExamButton, setShowStartExamButton] = useState<boolean>(false);
    const [examMessage, setExamMessage] = useState<string | null>(null);
    const [emailFound, setEmailFound] = useState<boolean>(false);
    const [userDate, setUserDate] = useState<Date | null>(null);
    const navigate = useNavigate();

    const targetDate = new Date('2024-10-02T08:57:00'); // 5 PM on September 21, 2024
    const olympiadBDate = new Date('2024-10-19T17:00:00'); // 5 PM on Oct 19, 2024
    const compareDate = '2024-09-30T00:00:00'

    // useEffect(() => {
    //     const checkExamStatus = () => {
    //         const now = new Date();

    //         // Determine the effective date based on user's registration date
    //         const olympiadNextDate = userDate && userDate < new Date(compareDate) ? targetDate : olympiadBDate;

    //         // Condition 1: If current timestamp matches targetDate or targetDate is older than current timestamp
    //         if (now >= olympiadNextDate) {
    //             setShowStartExamButton(true);
    //         }
    //         console.log(now >= olympiadNextDate)

    //         // Condition 2: If current timestamp is older than 2 hours past olympiadNextDate
    //         const twoHoursPast = new Date(olympiadNextDate.getTime() + 2 * 60 * 60 * 1000);
    //         if (now > twoHoursPast) {
    //             setShowStartExamButton(false);
    //         }
    //     };

    //     checkExamStatus();
    //     const intervalId = setInterval(checkExamStatus, 1000);
    //     return () => clearInterval(intervalId);
    // }, [targetDate]);


    const userTimestampLogic = async (userEmail: string) => {
        try {
            const userQuery = query(collection(firestore, 'OlympiadUsers'), where('email', '==', userEmail));
            const userSnapshot = await getDocs(userQuery);
            if (!userSnapshot.empty) {
                const userDoc = userSnapshot.docs[0];
                const userTimeStamp = userDoc.data().timeStamp;

                // Check if userTimeStamp is a Firestore Timestamp or a Date
                let retrievedUserDate;
                if (userTimeStamp instanceof Date) {
                    retrievedUserDate = userTimeStamp; // It's already a Date
                } else if (userTimeStamp.toDate) {
                    retrievedUserDate = userTimeStamp.toDate(); // Firestore Timestamp
                } else {
                    retrievedUserDate = new Date(userTimeStamp); // Assume it's a valid date string or timestamp
                }

                const comparisonDate = new Date(compareDate); // Sept 30, 2024

                // Store user registration date for future use
                setUserDate(retrievedUserDate);
                console.log(userDate)
                if (retrievedUserDate < comparisonDate) {
                    setExamMessage(`Exam Date: ${targetDate.toLocaleString()}`); // If user register is before 30th sept
                }else{
                    setExamMessage(`Exam Date: ${olympiadBDate.toLocaleString()}`); // If user register is after 30th sept
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };


    useEffect(() => {
        const checkUserEmail = async () => {
            const olympdPrefixData = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
            const userEmail = olympdPrefixData.email;

            if (userEmail) {
                const q = query(collection(firestore, 'm24Result'), where('email', '==', userEmail));
                const querySnapshot = await getDocs(q);
                setEmailFound(!querySnapshot.empty);
                await userTimestampLogic(userEmail);
            }
        };

        checkUserEmail();
    }, []);

    const handleStartExamClick = () => {
        navigate('/ExaminationRules');
        setShowStartExamButton(false);
    };

    const handleClick = (path: string) => {
        setActiveButton(path);
        navPath(path);
    };

    const renderExamButton = () => (
        emailFound ? (
            <span className="startedNote">You have already completed the exam.</span>
        ) : (
            <>
                <button onClick={handleStartExamClick} disabled={!showStartExamButton}>
                    Start Exam
                </button>
                {examMessage && <span className="scheduledMessage">{examMessage}</span>}
            </>
        )
    );

    return (
        <div className='navigation'>
            <button
                className={activeButton === '/CheckExamSystem' ? 'active' : ''}
                onClick={() => handleClick('/CheckExamSystem')}
            >
                Check Demo Exam
            </button>
            {renderExamButton()}
            {['/AboutOlympiad', '/ReferEarn', '/Awards', '/FAQ', '/LiveMasterClass', '/Report', '/AboutUpEducators', '/CoursesForEducators'].map(path => (
                <button
                    key={path}
                    className={activeButton === path ? 'active' : ''}
                    onClick={() => handleClick(path)}
                >
                    {path.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                </button>
            ))}
        </div>
    );
};

export default PageNavigation;

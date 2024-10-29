import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestore } from '../../utils/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';

import Button from "../../components/Buttons/Button";

const ExamData = () => {
    const [showStartExamButton, setShowStartExamButton] = useState<boolean>(false);
    const navigate = useNavigate();

    const [examMessage, setExamMessage] = useState<string | null>(null);
    const [emailFound, setEmailFound] = useState<boolean>(false);
    const [userDate, setUserDate] = useState<Date | null>(null);

    const targetDate = new Date('2024-10-02T08:57:00'); // 5 PM on September 21, 2024
    const olympiadBDate = new Date('2024-10-19T17:00:00'); // 5 PM on Oct 19, 2024
    const compareDate = '2024-09-30T00:00:00'

    // Helper function to format date in DD-MM-YY format
    const formatDateTime = (date: any) => {
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true // Use 12-hour format
        });
    };

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
                    setExamMessage(`Exam Date: ${formatDateTime(targetDate)}`); // If user register is before 30th sept
                } else {
                    setExamMessage(`Exam Date: ${formatDateTime(olympiadBDate)}`); // If user register is after 30th sept
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
            const olympiadName = olympdPrefixData.olympiadName;

            if (userEmail) {
                const q = query(collection(firestore, `${olympiadName}Result`), where('email', '==', userEmail));
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
    const renderExamButton = () => (
        emailFound ? (
            <span className="startedNote">You have already completed the exam.</span>
        ) : (
            <>
                <Button onClick={handleStartExamClick} isDisabled={!showStartExamButton} title="Start Exam" type="button" />
            </>
        )
    );
    return (
        <div className='how-it-works'>
            <h3>How It Works?</h3>

            <div className='works-card'>
                <div className='works-card-title'>
                    <div className='works-card-description'>
                        <h1>Check Your System Guidelines</h1>
                        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500.</p>
                        <div className='cta'>
                            <Button title='Check Demo Exam' type='button' />
                        </div>
                    </div>
                </div>
            </div>
            <div className='works-card'>
                <div className='works-card-title'>
                    <div className='works-card-description'>
                        <h1> Start Exam</h1>
                        <p>{examMessage && examMessage}</p>
                        <div className='cta'>
                            {renderExamButton()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default ExamData;
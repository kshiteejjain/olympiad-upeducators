import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestore } from '../../utils/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import Button from "../../components/Buttons/Button";

const ExamData = ({ onCheckDemoExam }: any) => {
    const [showStartExamButton, setShowStartExamButton] = useState<boolean>(false);
    const [examMessage, setExamMessage] = useState<string | null>(null);
    const [emailFound, setEmailFound] = useState<boolean>(false);
    const compareDate = '2025-02-01T00:00:00';

    const loggedInUserEmail = JSON.parse(localStorage.getItem('olympd_prefix') || '{}').email;

    const adminEmails = [
        'kshiteejjain@gmail.com',
        'anjalis@upeducators.com',
        'academics@upeducators.com',
        'namank@upeducators.com',
        'ankushb@upeducators.com'
    ];
    const isAdmin = adminEmails.includes(loggedInUserEmail);
    const navigate = useNavigate();

    // Helper function to format date in DD-MM-YY format
    const formatDateTime = (date: any) => {
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            // hour: '2-digit',
            // minute: '2-digit',
            // hour12: true // Use 12-hour format
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

                const comparisonDate = new Date(compareDate); // 01-02-2025

                // Compare user registration date with comparisonDate (01-02-2025)
                if (retrievedUserDate < comparisonDate) {
                    setExamMessage(`Exam Date: ${formatDateTime(new Date('2025-02-01T17:00:00'))}`); // If user registered before 01-02-2025
                } else {
                    setExamMessage(`Exam Date: ${formatDateTime(new Date('2025-02-08T17:00:00'))}`); // If user registered after 01-02-2025
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
            <p className="startedNote">You have already completed the exam.</p>
        ) : (
            <>
                {examMessage && <p>{examMessage}</p>}
                <div className="cta">
                    <Button onClick={handleStartExamClick} isDisabled={!showStartExamButton} title="Start Final Exam" type="button" />
                    {isAdmin && (
                        <Button onClick={handleStartExamClick} title="Start Exam - Admin" type="button" />
                    )}
                </div>
                <p>Click on the Start Final Exam button between 4:30 pm and 6 pm IST. This is the final exam and Exam can be attempted only once</p>
            </>
        )
    );
    return (
        <div className='how-it-works content'>
            <h3>Check Exam System Guidelines</h3>

            <div className='works-card'>
                <div className='works-card-title'>
                    <div className='works-card-description'>
                        <h1>Check Exam System</h1>
                        <p>1. You will be able to write the Exam only on Laptop/Desktop and NOT MOBILE.</p>
                        <p>2. Check your system setup, including camera and microphone, and familiarize yourself with the exam interface to ensure a smooth experience during the main exam</p>
                        <div className='cta'>
                            <Button title='Check Demo Exam' type='button' onClick={onCheckDemoExam} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='works-card'>
                <div className='works-card-title'>
                    <div className='works-card-description'>
                        <h1> Start Exam</h1>
                        {renderExamButton()}
                    </div>
                </div>
            </div>
        </div>
    )
};
export default ExamData;
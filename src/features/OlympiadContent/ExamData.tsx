import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestore } from '../../utils/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import Button from "../../components/Buttons/Button";

const ExamData = ({ onCheckDemoExam }: any) => {
    const [showStartExamButton, setShowStartExamButton] = useState<boolean>(false);
    const navigate = useNavigate();

    const [examMessage, setExamMessage] = useState<string | null>(null);
    const [emailFound, setEmailFound] = useState<boolean>(false);

    const targetDate = new Date('2025-01-18T17:00:00');
    const olympiadBDate = new Date('2025-01-18T17:00:00');
    const compareDate = '2024-11-05T00:00:00'

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
            <p className="startedNote">You have already completed the exam.</p>
        ) : (
            <>
                {examMessage && <p>{examMessage}</p>} {/* Conditionally show the exam message */}
                <div className="cta">
                    <Button onClick={handleStartExamClick} isDisabled={!showStartExamButton} title="Start Exam" type="button" />
                </div>
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
                        <p>Check your system setup, including camera and microphone, and familiarize yourself with the exam interface to ensure a smooth experience during the main exam</p>
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
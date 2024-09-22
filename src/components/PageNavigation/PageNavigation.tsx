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
    const navigate = useNavigate();

    const targetDate = new Date('2024-09-22T18:43:00'); // 5 PM on September 22, 2024

    useEffect(() => {
        const checkExamStatus = () => {
            const now = new Date();
            const twoHoursPast = new Date(targetDate.getTime() + 2 * 60 * 60 * 1000);
            
            // Check if the current time matches the target date
            const isTargetDateNow = Math.abs(now.getTime() - targetDate.getTime()) < 1000; // 1 second tolerance

            if (now < targetDate) {
                // Future date
                setShowStartExamButton(false);
                setExamMessage(`Exam Date: ${targetDate.toLocaleString()}`);
            } else if (isTargetDateNow) {
                // Exact target date time
                setShowStartExamButton(true);
                setExamMessage('1');
            } else if (now > twoHoursPast) {
                // More than 2 hours past target date
                setShowStartExamButton(false);
                setExamMessage("Exam date is gone.");
            } else {
                // Between target date and two hours past
                setShowStartExamButton(true);
                setExamMessage(null);
            }
        };

        checkExamStatus();
        const intervalId = setInterval(checkExamStatus, 1000);
        return () => clearInterval(intervalId);
    }, [targetDate]);

    useEffect(() => {
        const checkUserEmail = async () => {
            const olympdPrefixData = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
            const userEmail = olympdPrefixData.email;

            if (userEmail) {
                const q = query(collection(firestore, 'm24Result'), where('email', '==', userEmail));
                const querySnapshot = await getDocs(q);
                setEmailFound(!querySnapshot.empty);
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
                Check Exam System
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

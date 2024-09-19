import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import './PageNavigation.css';

const PageNavigation = ({ navPath }: any) => {
    const [activeButton, setActiveButton] = useState<string | null>(null);
    const [showStartExamButton, setShowStartExamButton] = useState<boolean>(true);
    const [examStarted, setExamStarted] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check localStorage to see if examStarted is true
        const olympdPrefixData = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
        if (olympdPrefixData.examStarted) {
            setExamStarted(true);
            setShowStartExamButton(false);
        }

        // Hide the button at 6 PM on September 22, 2024
        const targetDate = new Date('2024-09-21T18:00:00'); // 6 PM on September 22, 2024
        const now = new Date();
        if (now > targetDate) {
            setShowStartExamButton(false);
        } else {
            const timeUntilTargetDate = targetDate.getTime() - now.getTime();
            const hideButtonAtTargetDateTimeout = setTimeout(() => {
                setShowStartExamButton(false);
            }, timeUntilTargetDate);

            return () => clearTimeout(hideButtonAtTargetDateTimeout);
        }
    }, []);

    const handleStartExamClick = () => {
        // Navigate to the ExaminationRules page
        navigate('/ExaminationRules');

        // Hide the button after 40 minute
        setTimeout(() => {
            // Update localStorage to set examStarted to true
            const olympdPrefixData = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
            olympdPrefixData.examStarted = true;
            localStorage.setItem('olympd_prefix', JSON.stringify(olympdPrefixData));
            setExamStarted(true);

            // Hide the button
            setShowStartExamButton(false);
            window.location.reload();
        }, 40 * 60 * 1000); // 40 minute in milliseconds
    };

    const handleClick = (path: string) => {
        setActiveButton(path);
        navPath(path);
    };

    return (
        <div className='navigation'>
            <button
                className={activeButton === '/CheckExamSystem' ? 'active' : ''}
                onClick={() => handleClick('/CheckExamSystem')}
            >
                Check Exam System
            </button>
            {showStartExamButton ? (
                <button onClick={handleStartExamClick}>Start Exam</button>
            ) : examStarted ? (
                <span className="startedNote">Your exam has started</span>
            ) : null}
            {/* <button
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
                className={activeButton === '/LiveMasterClass' ? 'active' : ''}
                onClick={() => handleClick('/LiveMasterClass')}
            >
                Live Masterclass
            </button>
            <button
                className={activeButton === '/Report' ? 'active' : ''}
                onClick={() => handleClick('/Report')}
            >
                Report
            </button> */}
            <button
                className={activeButton === '/AboutUpEducators' ? 'active' : ''}
                onClick={() => handleClick('/AboutUpEducators')}
            >
                About upEducators
            </button>
            {/* <button
                className={activeButton === '/CoursesForEducators' ? 'active' : ''}
                onClick={() => handleClick('/CoursesForEducators')}
            >
                Courses for Educators
            </button> */}
        </div>
    );
};

export default PageNavigation;

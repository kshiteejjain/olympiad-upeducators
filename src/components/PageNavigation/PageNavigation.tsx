import { useState } from "react";
import { useNavigate } from "react-router-dom";

import './PageNavigation.css';

const PageNavigation = ({ navPath }: any) => {
    const [activeButton, setActiveButton] = useState<string | null>(null);
    const navigate = useNavigate();
    const handleClick = (path: string) => {
        setActiveButton(path);
        navPath(path);
    };

    return (
        <div className='navigation'>
            <button onClick={() => navigate('/ExaminationRules')}>Start Exam</button>
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

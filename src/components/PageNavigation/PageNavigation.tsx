import { useState } from "react";

import './PageNavigation.css';

const PageNavigation = ({ navPath }: any) => {
    const [activeButton, setActiveButton] = useState<string | null>(null);

    const handleClick = (path: string) => {
        setActiveButton(path);
        navPath(path);
    };

    return (
        <div className='navigation'>
            <button
                className={activeButton === '/ExamData' ? 'active' : ''}
                onClick={() => handleClick('/ExamData')}
            >
                Test
            </button>
            <button
                className={activeButton === '/CheckExamSystem' ? 'active' : ''}
                onClick={() => handleClick('/CheckExamSystem')}
            >
                Check Demo Exam
            </button>
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

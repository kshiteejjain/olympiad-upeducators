import { useState } from "react";
import './PageNavigation.css';

const PageNavigation = ({ navPath }: any) => {
    const [activeButton, setActiveButton] = useState<string | null>(null);

    const handleClick = (path: string) => {
        setActiveButton(path);
        navPath(path);
    };

    const paths = ['/AboutOlympiad', '/ReferEarn', '/Awards', '/FAQ', '/LiveMasterClass', '/Report', '/AboutupEducators', '/CoursesForEducators'];
    const formatPathName = (path: string) => {
        // Special case for 'AboutupEducators'
        if (path === '/AboutupEducators') {
            return 'About upEducators';
        }
        // General rule for formatting other paths
        return path.slice(1).replace(/([A-Z])/g, ' $1').trim();
    };
    return (
        <div className='navigation'>
            {paths.map((path) => (
                <>
                    <button
                        className={activeButton === path ? 'active' : ''}
                        onClick={() => handleClick(path)}
                    >
                        {formatPathName(path)}
                    </button>
                    {/* Add Start Exam button after AboutOlympiad */}
                    {path === '/AboutOlympiad' && (
                        <button
                            className={activeButton === '/ExamData' ? 'active' : ''}
                            onClick={() => handleClick('/ExamData')}
                        >
                            Exam Corner
                        </button>
                    )}
                </>
            ))}
        </div>
    );
};

export default PageNavigation;

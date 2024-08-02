import { useNavigate } from "react-router-dom";
import { useState } from "react";

import './PageNavigation.css';

const PageNavigation = () => {
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState(null);

    const handleClick = (path: any) => {
        setActiveButton(path);
        navigate(path);
    };

    return (
        <div className='navigation'>
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
        </div>
    );
};

export default PageNavigation;

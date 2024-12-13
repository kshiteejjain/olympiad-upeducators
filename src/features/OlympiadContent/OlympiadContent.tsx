import { Suspense, lazy, useState, useEffect, ComponentType } from 'react';
import PageNavigation from '../../components/PageNavigation/PageNavigation';
import { fetchUserOlympiadData } from '../../utils/firebaseUtils';

import './OlympiadContent.css';

// Retrieve olympiad prefix from localStorage
const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');

// Dynamically load components based on olympiadName
const loadComponent = (componentName: string) => {
    if (componentName === 'ExamData') {
        return lazy(() => import(`./ExamData.tsx`));
    }
    if (componentName === 'CoursesForEducators') {
        return lazy(() => import(`./CoursesForEducators.tsx`));
    }
    if (componentName === 'AboutupEducators') {
        return lazy(() => import(`./AboutUpEducators.tsx`));
    }
    if (componentName === 'CheckExamSystem') {
        return lazy(() => import(`./CheckExamSystem.tsx`));
    }
    if (componentName === 'ReferEarn') {
        return lazy(() => import(`./ReferEarn.tsx`));
    }

    const olympiadName = olympdPrefix.olympiadName; // Get olympiadName from localStorage
    return lazy(() => import(`./${olympiadName}/${componentName}.tsx`)); // Load other components dynamically
};

// Load components
const AboutOlympiad = loadComponent('AboutOlympiad');
const ExamData = loadComponent('ExamData');
const ReferEarn = loadComponent('ReferEarn');
const Awards = loadComponent('Awards');
const FAQ = loadComponent('FAQ');
const LiveMasterClass = loadComponent('LiveMasterClass');
const Report = loadComponent('Report');
const AboutupEducators = loadComponent('AboutupEducators');
const CoursesForEducators = loadComponent('CoursesForEducators');
const CheckExamSystem = loadComponent('CheckExamSystem');

// Map paths to components
const componentMap: Record<string, ComponentType<any>> = {
    '/AboutOlympiad': AboutOlympiad,
    '/ExamData': ExamData,
    '/ReferEarn': ReferEarn,
    '/Awards': Awards,
    '/FAQ': FAQ,
    '/LiveMasterClass': LiveMasterClass,
    '/Report': Report,
    '/AboutupEducators': AboutupEducators,
    '/CoursesForEducators': CoursesForEducators,
    '/CheckExamSystem': CheckExamSystem
};

// Default component to display
const DefaultComponent = AboutOlympiad;

const OlympiadContent = () => {
    const [CurrentComponent, setCurrentComponent] = useState<ComponentType<any>>(DefaultComponent);
    const [olympiads, setOlympiads] = useState<string[]>([]); // State to store Olympiad names
    const olympiadName = olympdPrefix.olympiad; // Get olympiadName from localStorage

    useEffect(() => {
        const isFirstLoad = localStorage.getItem('isFirstLoad');
        
        // If the page is loading for the first time, reload the page
        if (!isFirstLoad) {
            localStorage.setItem('isFirstLoad', 'true');
            window.location.reload();
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const email = olympdPrefix.email;
            if (email) {
                const data = await fetchUserOlympiadData(email);
                const userOlympiads = data.flatMap(user => user.olympiad || []);
                setOlympiads(Array.from(new Set(userOlympiads)));
            }
        };

        fetchData();
    }, [olympiadName]); // Dependency array includes olympiadName

    useEffect(() => {
        // Fetch the olympiad from local storage
        const path = `/${olympiadName}`; // Set path based on olympiadName
        const newComponent = componentMap[path] || DefaultComponent; // Load component based on path
        setCurrentComponent(newComponent); // Set the current component to be displayed
    }, [olympiadName]); // Set CurrentComponent based on olympiadName

    const handlePathChange = (path: string) => {
        // Update the current component based on the path
        const newComponent = componentMap[path] || DefaultComponent;
        setCurrentComponent(newComponent);
    };

    const handleOlympiadClick = (selectedOlympiad: string) => {
        const storedData = localStorage.getItem('olympd_prefix');
        const olympadPrefix = storedData ? JSON.parse(storedData) : { olympiad: [] };

        // Replace the existing olympiad name with the new selection
        olympadPrefix.olympiadName = selectedOlympiad;

        // Save the updated object to localStorage
        localStorage.setItem('olympd_prefix', JSON.stringify(olympadPrefix));

        // Reload the window to reflect changes
        window.location.reload();
    };

    const handleCheckDemoExam = () => {
        handlePathChange('/CheckExamSystem');
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PageNavigation navPath={handlePathChange} />
            <div className='olympiad-landing'>
                {olympiads.length > 1 && (
                    <div className="fetched-olympiads-parent">
                        <h3>Your Registered Olympiad's</h3>
                        <ul className='fetched-olympiads'>
                            {olympiads.map((olympiad, index) => {
                                const isActive = olympiad === olympdPrefix.olympiadName; // Check if the olympiad is active
                                return (
                                    <li
                                        key={index}
                                        onClick={() => handleOlympiadClick(olympiad)}
                                        className={isActive ? 'active' : ''} // Apply active class if the olympiad is active
                                    >
                                        {olympiad === 'p25' ? 'Primary 2025'
                                            : olympiad === 'm24' ? 'Maths 2024'
                                                : olympiad === 'e25' ? 'English 2025'
                                                    : olympiad}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
                <CurrentComponent loadComponent={loadComponent} onCheckDemoExam={handleCheckDemoExam} />
            </div>
        </Suspense>
    );
};

export default OlympiadContent;
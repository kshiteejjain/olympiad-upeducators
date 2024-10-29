import { Suspense, lazy, useState, useEffect, ComponentType } from 'react';
import PageNavigation from '../../components/PageNavigation/PageNavigation';
import { fetchUserOlympiadData } from '../../utils/firebaseUtils';

import './OlympiadContent.css';

// Retrieve olympiad prefix from localStorage
const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');

// Dynamically load components based on component name
const loadComponent = (componentName: string) => {
    const componentsWithoutPrefix = ['ExamData']; // ExamData is a special case
    const path = componentsWithoutPrefix.includes(componentName) 
        ? `../../features/OlympiadContent/${componentName}.tsx` // Adjusted path for ExamData
        : `./${olympdPrefix.olympiadName}/${componentName}.tsx`;
    return lazy(() => import(path));
};

// Load components
const ExamData = loadComponent('ExamData');
const AboutOlympiad = loadComponent('AboutOlympiad');
const ReferEarn = loadComponent('ReferEarn');
const Awards = loadComponent('Awards');
const FAQ = loadComponent('FAQ');
const LiveMasterClass = loadComponent('LiveMasterClass');
const Report = loadComponent('Report');
const AboutUpEducators = loadComponent('AboutUpEducators');
const CoursesForEducators = loadComponent('CoursesForEducators');
const CheckExamSystem = loadComponent('CheckExamSystem');

// Map paths to components
const componentMap: Record<string, ComponentType<any>> = {
    '/ExamData': ExamData, // Path for ExamData
    '/AboutOlympiad': AboutOlympiad,
    '/ReferEarn': ReferEarn,
    '/Awards': Awards,
    '/FAQ': FAQ,
    '/LiveMasterClass': LiveMasterClass,
    '/Report': Report,
    '/AboutUpEducators': AboutUpEducators,
    '/CoursesForEducators': CoursesForEducators,
    '/CheckExamSystem': CheckExamSystem
};

// Default component to display
const DefaultComponent = AboutOlympiad;

const OlympiadContent = () => {
    const [CurrentComponent, setCurrentComponent] = useState<ComponentType<any>>(DefaultComponent);
    const [olympiads, setOlympiads] = useState<string[]>([]);
    const olympiadName = olympdPrefix.olympiad;

    useEffect(() => {
        const isFirstLoad = localStorage.getItem('isFirstLoad');
        if (!isFirstLoad) {
            localStorage.setItem('isFirstLoad', 'true');
            window.location.reload();
        }

        const fetchData = async () => {
            const email = olympdPrefix.email;
            if (email) {
                const data = await fetchUserOlympiadData(email);
                const userOlympiads = data.flatMap(user => user.olympiad || []);
                setOlympiads(Array.from(new Set(userOlympiads)));
                console.log('olympiads', olympiads);
            }
        };

        fetchData();
    }, [olympiadName]);

    useEffect(() => {
        if (olympiadName) {
            const path = `/${olympiadName}`;
            const newComponent = componentMap[path] || DefaultComponent;
            setCurrentComponent(newComponent);
        }
    }, [olympiadName]);

    const handlePathChange = (path: string) => {
        const newComponent = componentMap[path] || DefaultComponent;
        setCurrentComponent(newComponent);
    };

    const handleOlympiadClick = (selectedOlympiad: string) => {
        const storedData = localStorage.getItem('olympd_prefix');
        const olympadPrefix = storedData ? JSON.parse(storedData) : { olympiad: [] };
        olympadPrefix.olympiadName = selectedOlympiad;
        localStorage.setItem('olympd_prefix', JSON.stringify(olympadPrefix));
        window.location.reload();
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
                                const olympiadLabel = olympiad === 's24' ? 'Science 2024'
                                    : olympiad === 'm24' ? 'Maths 2024'
                                    : olympiad;

                                return (
                                    <li key={index} onClick={() => handleOlympiadClick(olympiad)}>
                                        {olympiadLabel}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
                <CurrentComponent />
            </div>
        </Suspense>
    );
};

export default OlympiadContent;

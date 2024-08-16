import React, { Suspense, lazy, useState, ComponentType } from 'react';
import PageNavigation from '../../components/PageNavigation/PageNavigation';

import './OlympiadContent.css';

// Retrieve olympiad prefix from localStorage
const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
const dynamicPath = olympdPrefix.olympiadName || 'm24'; // Default to 'm24' if no olympiad is set

// Lazy load components based on dynamicPath
const AboutOlympiad = lazy(() => import(`./${dynamicPath}/AboutOlympiad.tsx`));
const ReferEarn = lazy(() => import(`./${dynamicPath}/ReferEarn.tsx`));
const Awards = lazy(() => import(`./${dynamicPath}/Awards.tsx`));
const FAQ = lazy(() => import(`./${dynamicPath}/FAQ.tsx`));
const LiveMasterClass = lazy(() => import(`./${dynamicPath}/LiveMasterClass.tsx`));
const Report = lazy(() => import(`./${dynamicPath}/Report.tsx`));
const AboutUpEducators = lazy(() => import(`./${dynamicPath}/AboutUpEducators.tsx`));
const CoursesForEducators = lazy(() => import(`./${dynamicPath}/CoursesForEducators.tsx`));

// Map paths to components
const componentMap: Record<string, ComponentType<any>> = {
    '/AboutOlympiad': AboutOlympiad,
    '/ReferEarn': ReferEarn,
    '/Awards': Awards,
    '/FAQ': FAQ,
    '/LiveMasterClass': LiveMasterClass,
    '/Report': Report,
    '/AboutUpEducators': AboutUpEducators,
    '/CoursesForEducators': CoursesForEducators,
};

// Default component to display
const DefaultComponent = AboutOlympiad;

const OlympiadContent: React.FC = () => {
    const [CurrentComponent, setCurrentComponent] = useState<ComponentType<any>>(DefaultComponent);

    const handlePathChange = (path: string) => {
        // Update the current component based on the path
        const newComponent = componentMap[path] || DefaultComponent;
        setCurrentComponent(newComponent);
        console.log(`Active path set to: ${path}`);

        // Update localStorage with the new path
        const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
        olympdPrefix.olympiad = path;
        localStorage.setItem('olympd_prefix', JSON.stringify(olympdPrefix));
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PageNavigation navPath={handlePathChange} />
            <CurrentComponent />
        </Suspense>
    );
};

export default OlympiadContent;

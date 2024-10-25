import { Suspense, lazy, useState, useEffect, ComponentType } from 'react';
import PageNavigation from '../../components/PageNavigation/PageNavigation';
import { fetchUserOlympiadData } from '../../utils/firebaseUtils';

import './OlympiadContent.css';

// Retrieve olympiad prefix from localStorage
const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');

// Dynamically load components based on olympiadName
const loadComponent = (componentName: string) => {
    const olympiadName = olympdPrefix.olympiadName; // Get olympiadName from localStorage
    return lazy(() => import(`./${olympiadName}/${componentName}.tsx`)); // Load the component dynamically
};

// Load components
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
    const [olympiads, setOlympiads] = useState<string[]>([]); // State to store Olympiad names
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const olympiadName = olympdPrefix.olympiad; // Get olympiadName from localStorage

    useEffect(() => {
        // Check if the component has been loaded for the first time
        const isFirstLoad = localStorage.getItem('isFirstLoad');

        if (!isFirstLoad) {
            localStorage.setItem('isFirstLoad', 'true');
            window.location.reload(); // Reload on first load
        }

        const fetchData = async () => {
            if (!olympiadName) { // Fetch data only if olympiadName is not set
                try {
                    const email = olympdPrefix.email;
                    if (email) {
                        const data = await fetchUserOlympiadData(email);
                        // Extract Olympiad names from the fetched user data
                        const userOlympiads = data.flatMap(user => user.olympiad || []);
                        setOlympiads(Array.from(new Set(userOlympiads))); // Remove duplicates
                    }
                } catch (err) {
                    console.error('Error fetching user data:', err);
                }
            }
            setIsLoading(false); // Set loading to false after data fetch
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

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PageNavigation navPath={handlePathChange} />
            {/* Display loading spinner until olympiadName is fetched */}
            {isLoading ? (
                <div className="loading">Loading Olympiad Data...</div> // Loader component
            ) : (
                // Render the Olympiad data if olympiadName is not set
                !olympiadName && olympiads.length > 1 ? (
                    <div className="content">
                        <h2>Available Olympiads</h2>
                        <ul className='fetched-olympiads'>
                            {olympiads.length > 0 ? (
                                olympiads.map((olympiad, index) => {
                                    const olympiadLabel = olympiad === 's24' ? 'Science 2024'
                                        : olympiad === 'm24' ? 'Maths 2024'
                                            : olympiad;

                                    return (
                                        <li key={index} onClick={() => handleOlympiadClick(olympiad)}>
                                            {olympiadLabel}
                                        </li>
                                    );
                                })
                            ) : (
                                <CurrentComponent />
                            )}
                        </ul>
                    </div>
                ) : (
                    <CurrentComponent /> // Render the current component
                )
            )}
        </Suspense>
    );
};

export default OlympiadContent;

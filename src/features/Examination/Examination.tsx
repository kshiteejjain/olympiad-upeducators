import React, { useState, useEffect, ChangeEvent } from 'react';
import { firestore } from '../../utils/firebase';
import { doc, setDoc } from 'firebase/firestore';
import ExamQuestions from '../../utils/m24.json';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';
import WebcamPermission from './WebcamPermission';
import CheckInternet from '../../utils/CheckInternet';
import Chevron from '../../assets/chevron-right.svg';

import './Examination.css';

type Option = string;
type Question = {
    question: string;
    options: Option[];
    type: 'radio' | 'checkbox';
    answer: string | string[];
    topic: string;
};
type ExamQuestionsType = Question[];
type SelectedAnswers = { [key: number]: Option[] | Option };

const Examination: React.FC = () => {
    const [questions, setQuestions] = useState<ExamQuestionsType>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [attempted, setAttempted] = useState<boolean[]>(new Array(ExamQuestions.length).fill(false));
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
    const [timer, setTimer] = useState<number>(3 * 60); // Default 60 minutes
    const [cameraAccess, setCameraAccess] = useState<boolean | null>(null);
    const [canRequestPermission, setCanRequestPermission] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [startTime, setStartTime] = useState<number>(Date.now()); // Track start time in milliseconds
    const [alertShown, setAlertShown] = useState<boolean>(false);

    // Load JSON dynamically based on localStorage value
    useEffect(() => {
        const olympiadData = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
        const olympiadName = olympiadData?.olympiadName || 'm24'; // Default to 'm24' if not set

        import(`../../utils/${olympiadName}.json`)
            .then((module) => {
                setQuestions(module.default as ExamQuestionsType);
                setAttempted(new Array(module.default.length).fill(false));
                setStartTime(Date.now());
            })
            .catch((error) => {
                console.error('Error loading JSON file:', error);
            });
    }, []);

    // Timer effect with auto-submit
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    submitReport(); // Auto-submit when time is over
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Alert effect when timer is less than or equal to 5 minutes
    useEffect(() => {
        if (timer <= 1 * 60 && !alertShown) {
            alert("You have less than 5 minutes remaining!");
            setAlertShown(true); // Ensure alert is shown only once
        }
    }, [timer, alertShown]);

    // LocalStorage effect
    useEffect(() => {
        const savedAttempted = JSON.parse(localStorage.getItem('attempted') || '[]') as boolean[];
        const savedSelectedAnswers = JSON.parse(localStorage.getItem('selectedAnswers') || '{}') as SelectedAnswers;

        setAttempted(savedAttempted.length ? savedAttempted : new Array(ExamQuestions.length).fill(false));
        setSelectedAnswers(savedSelectedAnswers);
    }, []);

    useEffect(() => {
        localStorage.setItem('attempted', JSON.stringify(attempted));
        localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers));
    }, [attempted, selectedAnswers]);

    // Camera access effect
    useEffect(() => {
        const requestCameraAccess = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                setCameraAccess(true);
                setCanRequestPermission(false);
            } catch (error) {
                console.error('Error accessing camera:', error);
                setCameraAccess(false);
                setCanRequestPermission(true);
            }
        };

        requestCameraAccess();
    }, []);

    // Effect to update attempted questions
    useEffect(() => {
        setAttempted(questions.map((_, index) => {
            const answers = selectedAnswers[index];
            return answers ? (Array.isArray(answers) ? answers.length > 0 : Boolean(answers)) : false;
        }));
    }, [selectedAnswers, questions]);

    const formatTime = (seconds: number): string =>
        `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' : ''}${seconds % 60}`;

    const handleNavigation = (direction: number): void =>
        setCurrentIndex(prev => Math.max(0, Math.min(questions.length - 1, prev + direction)));

    const handleRadioChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedAnswers({ ...selectedAnswers, [currentIndex]: event.target.value });
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const { value, checked } = event.target;
        const currentSelections = selectedAnswers[currentIndex] as Option[] || [];
        setSelectedAnswers({
            ...selectedAnswers,
            [currentIndex]: checked
                ? [...currentSelections, value]
                : currentSelections.filter(item => item !== value),
        });
    };

    const handleRequestPermission = async (): Promise<void> => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            setCameraAccess(true);
            setCanRequestPermission(false);
        } catch (error) {
            console.error('Error requesting camera permission:', error);
        }
    };
    const formatTimeTaken = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs}`;
    };

    const submitReport = async (): Promise<void> => {
        setLoading(true);
        const olympiadData = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
        const olympiadName = olympiadData?.olympiadName || 'm24'; // Default to 'm24' if not set
        const userEmail = olympiadData?.email || 'defaultUser'; // Assuming you have the user's email in localStorage
        const userName = olympiadData?.name;

        // Calculate time taken
        const endTime = Date.now();
        const timeTakenInSeconds = Math.floor((endTime - startTime) / 1000); // Time in seconds
        const formattedTimeTaken = formatTimeTaken(timeTakenInSeconds);

        // Create the report object
        const report = questions.map((question, index) => {
            const userAnswer = selectedAnswers[index] !== undefined ? selectedAnswers[index] : ''; // Fallback for undefined
            const correctAnswer = question.answer;

            const isCorrect = Array.isArray(correctAnswer)
                ? Array.isArray(userAnswer) && correctAnswer.every(a => userAnswer.includes(a)) && userAnswer.every(a => correctAnswer.includes(a))
                : userAnswer === correctAnswer;

            return {
                questionIndex: index,
                topic: question.topic || 'Unknown Topic', // Include topic of each question
                chosenAnswer: userAnswer,
                correctAnswer: correctAnswer || 'N/A', // Fallback for undefined
                isCorrect: isCorrect
            };
        });

        // Calculate total marks
        const totalMarks = report.reduce((count, item) => (item.isCorrect ? count + 1 : count), 0);

        // Structure the report data
        const reportData = {
            email: userEmail, // Store email directly
            name: userName || 'Unknown', // Fallback if name is not provided
            details: report,
            totalMarks: totalMarks,
            timeTaken: formattedTimeTaken,
            timestamp: new Date().toISOString() // Use ISO string format for timestamp
        };

        try {
            // Reference to the specific user's document in the Olympiad result collection
            const userDocRef = doc(firestore, `${olympiadName}Result`, userEmail);

            // Save the report data as the document under the user's email
            await setDoc(userDocRef, reportData);

            console.log('Report successfully saved to Firestore.');
            setLoading(false);
            localStorage.removeItem('selectedAnswers');
            localStorage.removeItem('attempted')
            const olympd_prefix = localStorage.getItem('olympd_prefix')
            let isExamOver = olympd_prefix  ? JSON.parse(olympd_prefix) : {}
            isExamOver.examOver= true;
            localStorage.setItem('olympd_prefix', JSON.stringify(isExamOver));
            window.close();
        } catch (error) {
            console.error('Error saving report to Firestore:', error);
        }
    };


    if (cameraAccess === null) return <div className="loading">Loading camera access...</div>;

    if (!cameraAccess) {
        return (
            <div className="no-camera-access">
                <p>Webcam permission denied. Please enable camera access to proceed.</p>
                {canRequestPermission && (
                    <Button type="button" title="Request Camera Permission" onClick={() => handleRequestPermission()} />
                )}
            </div>
        );
    }
    return (
        <div className='exam-started'>
            {loading && <Loader />}
            <div className="content">
                <div className="question-container">
                    <div className='quiz'>
                        <div className='quiz-header'>
                            <h2>Examination</h2>
                            <div className="timer">Time Left: <span>{formatTime(timer)}</span></div>
                        </div>
                        {questions.length > 0 && (
                            <>
                                <div className="question">
                                    <h3>{currentIndex + 1}. {questions[currentIndex].question}</h3>
                                    <div className="answer-options">
                                        {questions[currentIndex].type === 'radio' ? (
                                            questions[currentIndex].options.map((option, index) => (
                                                <div key={index} className="option">
                                                    <input
                                                        type="radio"
                                                        id={`radio-${index}`}
                                                        name={`question-${currentIndex}`}
                                                        value={option}
                                                        checked={selectedAnswers[currentIndex] === option}
                                                        onChange={handleRadioChange}
                                                    />
                                                    <label htmlFor={`radio-${index}`}>{option}</label>
                                                </div>
                                            ))
                                        ) : (
                                            questions[currentIndex].options.map((option, index) => (
                                                <div key={index} className="option">
                                                    <input
                                                        type="checkbox"
                                                        id={`checkbox-${index}`}
                                                        name={`checkbox-${index}`}
                                                        value={option}
                                                        checked={selectedAnswers[currentIndex]?.includes(option) || false}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label htmlFor={`checkbox-${index}`}>{option}</label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <div className="question-nav">
                                    <Button type="button" isIcon iconPath={Chevron} onClick={() => handleNavigation(-1)} isDisabled={currentIndex === 0} />
                                    <Button type="button" isIcon iconPath={Chevron} onClick={() => handleNavigation(1)} />
                                </div>
                                {/* {attempted.every(item => item === true) && <Button type="button" title="Submit Exam" onClick={() => submitReport()} />} */}
                              <Button type="button" title="Submit Exam" onClick={() => submitReport()} />
                                <CheckInternet />
                            </>
                        )}
                    </div>
                </div>
                <WebcamPermission /> {/* Pass position prop to position the webcam */}
            </div>
            <div className="question-list">
                <div className='listing'>
                    {questions.map((_, index) => (
                        <button
                            key={index}
                            className={`question-item ${attempted[index] ? 'attempted' : 'not-attempted'}`}
                            onClick={() => setCurrentIndex(index)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Examination;

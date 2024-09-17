import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { firestore } from '../../utils/firebase';
import { doc, setDoc } from 'firebase/firestore';
import ExamQuestions from '../../utils/m24.json';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';
import WebcamPermission from './WebcamPermission';
import CheckInternet from '../../utils/CheckInternet';

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

const Examination = () => {
    const examDurationInMinutes = 40; // You can set this to any duration you need, e.g., 60 minutes
    const examDurationInSeconds = examDurationInMinutes * 60;

    const [questions, setQuestions] = useState<ExamQuestionsType>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [attempted, setAttempted] = useState<boolean[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
    const [timer, setTimer] = useState<number>(examDurationInSeconds); // Set initial timer to exam duration
    const [cameraAccess, setCameraAccess] = useState<boolean | null>(null);
    const [canRequestPermission, setCanRequestPermission] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null); // Start time should be null initially
    const [alertShown, setAlertShown] = useState<boolean>(false);

    // Load JSON dynamically based on localStorage value
    useEffect(() => {
        const olympiadData = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
        const olympiadName = olympiadData?.olympiadName || 'm24'; // Default to 'm24' if not set

        import(`../../utils/${olympiadName}.json`)
            .then((module) => {
                setQuestions(module.default as ExamQuestionsType);
                setAttempted(new Array(module.default.length).fill(false));
                setStartTime(Date.now()); // Set start time when questions are loaded
            })
            .catch((error) => {
                console.error('Error loading JSON file:', error);
            });
    }, []);

    // Alert effect when timer is less than or equal to 60 seconds
    useEffect(() => {
        if (timer <= 300 && !alertShown) {
            alert("You have 5 minute remaining!");
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

    const submitReport = useCallback(async () => {
        if (!startTime) return; // Ensure startTime is valid
        alert('Submitting the exam?')
        setLoading(true);
        const olympiadData = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
        const olympiadName = olympiadData?.olympiadName || 'm24'; // Default to 'm24' if not set
        const userEmail = olympiadData?.email || 'defaultUser'; // Assuming you have the user's email in localStorage
        const userName = olympiadData?.name;

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
            timestamp: new Date().toISOString(),
            startTime: new Date(startTime).toISOString(),
            endTime: new Date().toISOString()
        };

        try {
            // Reference to the specific user's document in the Olympiad result collection
            const userDocRef = doc(firestore, `${olympiadName}Result`, userEmail);

            // Save the report data as the document under the user's email
            await setDoc(userDocRef, reportData);

            console.log('Report successfully saved to Firestore.');
            setLoading(false);
            localStorage.removeItem('selectedAnswers');
            localStorage.removeItem('attempted');
            const olympd_prefix = localStorage.getItem('olympd_prefix');
            let isExamOver = olympd_prefix ? JSON.parse(olympd_prefix) : {};
            isExamOver.examOver = true;
            localStorage.setItem('olympd_prefix', JSON.stringify(isExamOver));
            window.close();
        } catch (error) {
            console.error('Error saving report to Firestore:', error);
            setLoading(false);
        }
    }, [questions, selectedAnswers, startTime]);

    // Timer effect with auto-submit
    useEffect(() => {
        if (startTime === null) return; // Ensure startTime is set

        const interval = setInterval(() => {
            setTimer(prev => {
                const currentTime = Math.max(prev - 1, 0);
                if (currentTime === 0) {
                    submitReport(); // Auto-submit when time is over
                    clearInterval(interval);
                }
                return currentTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [submitReport, startTime]);

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
                                    <Button
                                        type="button"
                                        title="Previous Question"
                                        isIcon
                                        onClick={() => handleNavigation(-1)}
                                        isDisabled={currentIndex === 0}
                                    />
                                    {questions.length > 0 && (
                                        <Button
                                            type="button"
                                            title="Next Question"
                                            isIcon
                                            onClick={() => handleNavigation(1)}
                                            isDisabled={currentIndex === questions.length - 1}
                                        />
                                    )}
                                </div>
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

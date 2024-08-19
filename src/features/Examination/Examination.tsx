import React, { useState, useEffect, ChangeEvent } from 'react';
import ExamQuestions from '../../utils/ExamQuestions.json';
import Button from '../../components/Buttons/Button';
import WebcamPermission from './WebcamPermission';
import Chevron from '../../assets/chevron-right.svg';

import './Examination.css';

// Define types
type Option = string;

type Question = {
    question: string;
    options: Option[];
    type: 'radio' | 'checkbox';
    answer: string | string[];
    topic: string;
};

type ExamQuestionsType = Question[];

type SelectedAnswers = {
    [key: number]: Option[] | Option; // Adapted type to handle multiple selections (checkbox) or single selection (radio)
};

const Examination: React.FC = () => {
    const [questions] = useState<ExamQuestionsType>(ExamQuestions as ExamQuestionsType);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [attempted, setAttempted] = useState<boolean[]>(new Array(ExamQuestions.length).fill(false));
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
    const [timer, setTimer] = useState<number>(3600); // 1 hour in seconds
    const [cameraAccess, setCameraAccess] = useState<boolean | null>(null);
    const [canRequestPermission, setCanRequestPermission] = useState<boolean>(false);

    // Timer effect
    useEffect(() => {
        const interval = setInterval(() => setTimer(prev => Math.max(0, prev - 1)), 1000);
        return () => clearInterval(interval);
    }, []);

    // LocalStorage effect
    useEffect(() => {
        // Load attempted state and selected answers from localStorage
        const savedAttempted = JSON.parse(localStorage.getItem('attempted') || '[]') as boolean[];
        const savedSelectedAnswers = JSON.parse(localStorage.getItem('selectedAnswers') || '{}') as SelectedAnswers;

        setAttempted(savedAttempted.length ? savedAttempted : new Array(ExamQuestions.length).fill(false));
        setSelectedAnswers(savedSelectedAnswers);
    }, []);

    useEffect(() => {
        // Save attempted state and selected answers to localStorage
        localStorage.setItem('attempted', JSON.stringify(attempted));
        localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers));
    }, [attempted, selectedAnswers]);

    // Camera access effect
    useEffect(() => {
        const requestCameraAccess = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                setCameraAccess(true);
                setCanRequestPermission(false); // No need to request permission again
            } catch (error) {
                console.error('Error accessing camera:', error);
                setCameraAccess(false);
                setCanRequestPermission(true); // Allow user to request permission again
            }
        };

        requestCameraAccess();
    }, []);

    // Effect to update attempted questions based on selected answers
    useEffect(() => {
        const newAttempted = questions.map((_, index) => {
            const answers = selectedAnswers[index];
            return answers ? (Array.isArray(answers) ? answers.length > 0 : Boolean(answers)) : false;
        });
        setAttempted(newAttempted);
    }, [selectedAnswers, questions]);

    const formatTime = (seconds: number): string => `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' : ''}${seconds % 60}`;

    const handleNavigation = (direction: number): void => setCurrentIndex(prev => Math.max(0, Math.min(questions.length - 1, prev + direction)));

    const handleRadioChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const { value } = event.target;
        setSelectedAnswers(prevAnswers => ({
            ...prevAnswers,
            [currentIndex]: value // Only one value for radio buttons
        }));
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const { value, checked } = event.target;
        setSelectedAnswers(prevAnswers => {
            const currentSelections = prevAnswers[currentIndex] as Option[] || [];

            // Add or remove the value based on whether the checkbox is checked or not
            const updatedSelections = checked
                ? [...currentSelections, value]
                : currentSelections.filter(item => item !== value);

            return { ...prevAnswers, [currentIndex]: updatedSelections };
        });
    };

    const handleNextClick = (): void => {
        handleNavigation(1);
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

    // Function to submit the report
    const submitReport = (): void => {
        if (!Array.isArray(questions)) {
            console.error('Invalid input: questions must be an array.');
            return;
        }
    
        if (typeof selectedAnswers !== 'object') {
            console.error('Invalid input: selectedAnswers must be an object.');
            return;
        }
    
        // Create the report object
        const report = questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const correctAnswer = question.answer;
    
            // Check if the answer is correct
            const isCorrect = Array.isArray(correctAnswer)
                ? Array.isArray(userAnswer) && correctAnswer.every(a => userAnswer.includes(a)) && userAnswer.every(a => correctAnswer.includes(a))
                : userAnswer === correctAnswer;
    
            return {
                questionIndex: index,
                question: question.question,
                chosenAnswer: userAnswer,
                correctAnswer: correctAnswer,
                isCorrect: isCorrect
            };
        });
    
        // Calculate total marks
        const totalMarks = report.reduce((count, item) => item.isCorrect ? count + 1 : count, 0);
    
        // Log the JSON report
        console.log("Report:", JSON.stringify({
            topic: questions[0]?.topic || 'Unknown Topic', // Assuming all questions have the same topic
            details: report,
            totalMarks: totalMarks
        }, null, 2));
    }
    

    if (cameraAccess === null) {
        // Show loading message while requesting camera access
        return <div className="loading">Loading camera access...</div>;
    }

    // Uncomment this block if you need to handle camera access denial
    if (!cameraAccess) {
        return (
            <div className="no-camera-access">
                <p>Webcam permission denied. Please enable camera access to proceed.</p>
                {canRequestPermission && (
                    <Button
                        type="button"
                        title="Request Camera Permission"
                        onClick={handleRequestPermission}
                    />
                )}
            </div>
        );
    }

    return (
        <div className='exam-started'>
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
                                    <Button type="button" isIcon iconPath={Chevron} onClick={handleNextClick} />
                                </div>
                                <Button type="button" title="Submit Exam" onClick={submitReport} />
                            </>
                        )}
                    </div>
                </div>
                {/* Webcam permission and video display */}
                <WebcamPermission />
            </div>
            <div className="question-list">
                <div className='listing'>
                    {questions.map((_, index) => (
                        <button
                            key={index}
                            className={`question-item ${attempted[index] ? 'attempted' : 'not-attempted'}`}
                            onClick={() => {
                                setCurrentIndex(index);
                            }}
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

import React, { useState, useEffect, ChangeEvent } from 'react';
import ExamQuestions from '../../utils/ExamQuestions.json';
import Button from '../../components/Buttons/Button';
import './Examination.css';

// Define types
type Option = string;

type Question = {
    question: string;
    options: Option[];
};

type ExamQuestionsType = Question[];

type SelectedAnswers = {
    [key: number]: Option;
};

const Examination: React.FC = () => {
    const [questions, setQuestions] = useState<ExamQuestionsType>(ExamQuestions as ExamQuestionsType);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [attempted, setAttempted] = useState<boolean[]>(new Array(ExamQuestions.length).fill(false));
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
    const [timer, setTimer] = useState<number>(3600); // 1 hour in seconds
    const [cameraAccess, setCameraAccess] = useState<boolean | null>(null); // null means not checked yet

    useEffect(() => {
        // Load attempted state and selected answers from localStorage
        const savedAttempted = JSON.parse(localStorage.getItem('attempted') || '[]') as boolean[];
        const savedSelectedAnswers = JSON.parse(localStorage.getItem('selectedAnswers') || '{}') as SelectedAnswers;

        setAttempted(savedAttempted.length ? savedAttempted : new Array(ExamQuestions.length).fill(false));
        setSelectedAnswers(savedSelectedAnswers);

        // Request camera access
        (async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
                setCameraAccess(true);
            } catch {
                setCameraAccess(false);
            }
        })();

        // Timer logic
        const interval = setInterval(() => setTimer(prev => Math.max(0, prev - 1)), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Save attempted state and selected answers to localStorage
        localStorage.setItem('attempted', JSON.stringify(attempted));
        localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers));
    }, [attempted, selectedAnswers]);

    const formatTime = (seconds: number): string => `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' : ''}${seconds % 60}`;

    const handleNavigation = (direction: number): void => setCurrentIndex(prev => Math.max(0, Math.min(questions.length - 1, prev + direction)));

    const handleOptionChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const { value } = event.target;
        setSelectedAnswers(prevAnswers => ({ ...prevAnswers, [currentIndex]: value }));
    };

    const handleNextClick = (): void => {
        setAttempted(prevAttempts => {
            const newAttempted = [...prevAttempts];
            newAttempted[currentIndex] = true;
            return newAttempted;
        });
        handleNavigation(1);
    };

    return (
        <div className="examination">
            <div className="question-container">
                <div className='quiz'>
                    <div className='quiz-header'>
                        <h1>Examination</h1>
                        <div className="timer">Time Left: <span>{formatTime(timer)}</span></div>
                    </div>
                    {questions.length > 0 && (
                        <>
                            <div className="question">
                                <h3>{currentIndex + 1}. {questions[currentIndex].question}</h3>
                                <div className="answer-options">
                                    {questions[currentIndex].options.map((option, index) => (
                                        <div key={index} className="option">
                                            <input
                                                type="radio"
                                                id={`option-${index}`}
                                                name={`question-${currentIndex}`}
                                                value={option}
                                                checked={selectedAnswers[currentIndex] === option}
                                                onChange={handleOptionChange}
                                            />
                                            <label htmlFor={`option-${index}`}>{option}</label>
                                        </div>
                                    ))}
                                </div>
                                <p>{currentIndex + 1} of {questions.length} Questions</p>
                            </div>
                            <div className="question-nav">
                                <Button type="button" title="Previous" onClick={() => handleNavigation(-1)} isDisabled={currentIndex === 0} />
                                <Button
                                    type="button"
                                    title="Next"
                                    onClick={handleNextClick}
                                    isDisabled={!selectedAnswers[currentIndex]}
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className="question-list">
                    {questions.map((_, index) => (
                        <button
                            disabled={!attempted[index]}
                            key={index}
                            className={`question-item ${attempted[index] ? 'attempted' : 'not-attempted'}`}
                            onClick={() => {
                                if (index <= currentIndex || attempted[index]) {
                                    setCurrentIndex(index);
                                }
                            }}
                        >
                            {index + 1} {questions[index].question}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Examination;

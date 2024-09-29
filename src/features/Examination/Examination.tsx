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
    topic: string;
    question: string;
    options: string[];
    type: 'radio' | 'checkbox';
    answer: string | string[];
};
type ExamQuestionsType = Question[];
type SelectedAnswers = { [key: number]: Option[] | Option };

type LevelQuestions = {
    topic: string;
    question: string;
    options: string[];
    type: 'radio' | 'checkbox';
    answer: string | string[];
};

type ExamQuestionsByLevel = {
    Level1: LevelQuestions[];
    Level2: LevelQuestions[];
    Level3: LevelQuestions[];
};

const Examination = () => {
    const examDurationInMinutes = 40;
    const examDurationInSeconds = examDurationInMinutes * 60;

    const [questions, setQuestions] = useState<ExamQuestionsType>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [attempted, setAttempted] = useState<boolean[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
    const [timer, setTimer] = useState<number>(examDurationInSeconds);
    const [cameraAccess, setCameraAccess] = useState<boolean | null>(null);
    const [canRequestPermission, setCanRequestPermission] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [alertShown, setAlertShown] = useState<boolean>(false);

    const [jsonFileName, setJsonFileName] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [filteredQuestions, setFilteredQuestions] = useState<ExamQuestionsType>([]);
    const [hasLevels, setHasLevels] = useState<boolean>(false);

    // Prevent Copy Paste
    useEffect(() => {
        const handleCopy = (event:  any) => {
            event.preventDefault();
        };

        const handleCut = (event: any) => {
            event.preventDefault();
        };

        const handlePaste = (event: any) => {
            event.preventDefault();
        };

        // Add event listeners to the document
        document.addEventListener('copy', handleCopy);
        document.addEventListener('cut', handleCut);
        document.addEventListener('paste', handlePaste);

        // Cleanup event listeners on component unmount
        return () => {
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('cut', handleCut);
            document.removeEventListener('paste', handlePaste);
        };
    }, []);

    useEffect(() => {
        const olympiadData = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
        const olympiadNames = olympiadData?.olympiad || [];
        const olympiadName = olympiadNames[0] || 'm24';

        import(`../../utils/${olympiadName}.json`)
            .then((module) => {
                const jsonData = module.default;
                const levelsExist = jsonData.Level1 || jsonData.Level2 || jsonData.Level3;
                setHasLevels(levelsExist);
                setJsonFileName(`${olympiadName}.json`);
                if (levelsExist) {
                    const allQuestions = [
                        ...(jsonData.Level1 || []),
                        ...(jsonData.Level2 || []),
                        ...(jsonData.Level3 || [])
                    ];
                    setQuestions(allQuestions);
                    setFilteredQuestions(allQuestions);
                } else {
                    setQuestions(jsonData);
                    setFilteredQuestions(jsonData);
                    setStartTime(Date.now());
                }
            })
            .catch((error) => {
                console.error('Error loading JSON file:', error);
            });
    }, []);

    useEffect(() => {
        const olympd_prefix = localStorage.getItem('olympd_prefix');
        if (olympd_prefix) {
            const sessionData = JSON.parse(olympd_prefix);
            const savedLevel = sessionData.selectedLevel;
            if (savedLevel) {
                setSelectedLevel(savedLevel);
            }
        }
    }, []);

    useEffect(() => {
        if (selectedLevel) {
            const levelQuestions = ExamQuestions[selectedLevel as keyof ExamQuestionsByLevel] || [];
    
            const filtered: ExamQuestionsType = levelQuestions.map((question) => ({
                topic: question.topic || 'Unknown Topic',
                question: question.question,
                options: question.options,
                type: question.type as 'radio' | 'checkbox', // Ensure correct type
                answer: question.answer // This can be either string or string[]
            }));
    
            setFilteredQuestions(filtered); // Now filtered is of type ExamQuestionsType
            setCurrentIndex(0);
            setAttempted(new Array(filtered.length).fill(false));
            setStartTime(Date.now());
        } else {
            setFilteredQuestions(questions);
        }
    }, [selectedLevel, questions]);
    

    const handleLevelSelect = (level: string) => {
        setSelectedLevel(level);
        const session = localStorage.getItem('olympd_prefix');
        if (session) {
            const sessionData = JSON.parse(session);
            sessionData.selectedLevel = level;
            localStorage.setItem('olympd_prefix', JSON.stringify(sessionData));
        }
        setStartTime(Date.now());
    };

    useEffect(() => {
        if (timer <= 300 && !alertShown) {
            alert("You have 5 minutes remaining!");
            setAlertShown(true);
        }
    }, [timer, alertShown]);

    useEffect(() => {
        const savedAttempted = JSON.parse(localStorage.getItem('attempted') || '[]') as boolean[];
        const savedSelectedAnswers = JSON.parse(localStorage.getItem('selectedAnswers') || '{}') as SelectedAnswers;
        const totalQuestions = selectedLevel 
        ? (ExamQuestions[selectedLevel as keyof ExamQuestionsByLevel] || []).length 
        : questions.length;
        setAttempted(savedAttempted.length ? savedAttempted : new Array(totalQuestions).fill(false));
        setSelectedAnswers(savedSelectedAnswers);
    }, []);

    useEffect(() => {
        localStorage.setItem('attempted', JSON.stringify(attempted));
        localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers));
    }, [attempted, selectedAnswers]);

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
        if (!startTime) return;
        alert('Submitting the exam?')
        setLoading(true);
        const olympiadData = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
        const olympiadName = olympiadData?.olympiadName || 'm24';
        const userEmail = olympiadData?.email || 'defaultUser';
        const userName = olympiadData?.name;

        const report = questions.map((question, index) => {
            const userAnswer = selectedAnswers[index] !== undefined ? selectedAnswers[index] : '';
            const correctAnswer = question.answer;

            const isCorrect = Array.isArray(correctAnswer)
                ? Array.isArray(userAnswer) && correctAnswer.every(a => userAnswer.includes(a)) && userAnswer.every(a => correctAnswer.includes(a))
                : userAnswer === correctAnswer;

            return {
                questionIndex: index,
                topic: question.topic || 'Unknown Topic',
                chosenAnswer: userAnswer,
                correctAnswer: correctAnswer || 'N/A',
                isCorrect: isCorrect,
                level: selectedLevel
            };
        });

        const totalMarks = report.reduce((count, item) => (item.isCorrect ? count + 1 : count), 0);

        const reportData = {
            email: userEmail,
            name: userName || 'Unknown',
            level: selectedLevel,
            details: report,
            totalMarks: totalMarks,
            timestamp: new Date().toISOString(),
            startTime: new Date(startTime).toISOString(),
            endTime: new Date().toISOString()
        };

        try {
            if (jsonFileName !== 'testQuestions.json') {
                const userDocRef = doc(firestore, `${olympiadName}Result`, userEmail);
                await setDoc(userDocRef, reportData);
                console.log('Report successfully saved to Firestore.');
            } else {
                console.log('Not submitting report to Firestore as the questions are from testQuestions.json');
            }

            setLoading(false);
            localStorage.removeItem('selectedAnswers');
            localStorage.removeItem('attempted');
            localStorage.removeItem('selectedLevel');
            const olympd_prefix = localStorage.getItem('olympd_prefix');
            let isExamOver = olympd_prefix ? JSON.parse(olympd_prefix) : {};
            isExamOver.examOver = true;
            localStorage.setItem('olympd_prefix', JSON.stringify(isExamOver));
            window.close();
        } catch (error) {
            console.error('Error saving report to Firestore:', error);
            setLoading(false);
        }
    }, [questions, selectedAnswers, startTime, jsonFileName]);

    useEffect(() => {
        if (startTime === null) return;

        const interval = setInterval(() => {
            setTimer(prev => {
                const currentTime = Math.max(prev - 1, 0);
                if (currentTime === 0) {
                    submitReport();
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

                        {hasLevels && selectedLevel === null ? (
                            <div className="level-selection">
                                <h3>Select Your Level For Question Paper:</h3>
                                <Button type="button" title="Level 1" onClick={() => handleLevelSelect('Level1')} />
                                <Button type="button" title="Level 2" onClick={() => handleLevelSelect('Level2')} />
                                <Button type="button" title="Level 3" onClick={() => handleLevelSelect('Level3')} />
                            </div>
                        ) : (
                            <>
                                {filteredQuestions.length > 0 && (
                                    <>
                                        <div className="question">
                                            <h3>
                                                {currentIndex + 1}.{" "}
                                                {filteredQuestions[currentIndex].question.split('\n').map((line, index) => (
                                                    <span key={index}>
                                                        {line}
                                                        {index < filteredQuestions[currentIndex].question.split('\n').length - 1 && <br />}
                                                    </span>
                                                ))}
                                            </h3>
                                            <div className="answer-options">
                                                {filteredQuestions[currentIndex].type === 'radio' ? (
                                                    filteredQuestions[currentIndex].options.map((option, index) => (
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
                                                    filteredQuestions[currentIndex].options.map((option, index) => (
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
                                                onClick={() => handleNavigation(-1)}
                                                isDisabled={currentIndex === 0}
                                            />
                                            <Button
                                                type="button"
                                                title="Next Question"
                                                onClick={() => handleNavigation(1)}
                                                isDisabled={currentIndex === filteredQuestions.length - 1}
                                            />
                                        </div>
                                        <Button type="button" title="Submit Exam" onClick={() => submitReport()} />
                                        <CheckInternet />
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <WebcamPermission />
            </div>
            <div className="question-list">
                    <div className='listing'>
                        {filteredQuestions.map((_, index) => (
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

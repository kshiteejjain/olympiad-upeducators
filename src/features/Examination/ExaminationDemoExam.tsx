import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import testQuestions from '../../utils/testQuestions.json';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';
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

const ExaminationDemoExam = () => {
    const examDurationInMinutes = 40;
    const examDurationInSeconds = examDurationInMinutes * 60;

    const [questions, setQuestions] = useState<ExamQuestionsType>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [attempted, setAttempted] = useState<boolean[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
    const [timer, setTimer] = useState<number>(examDurationInSeconds);
    const [loading, setLoading] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [alertShown, setAlertShown] = useState<boolean>(false);

    useEffect(() => {
        // Load test questions only
        setQuestions(testQuestions as ExamQuestionsType);
        setStartTime(Date.now());
    }, []);

    useEffect(() => {
        const savedAttempted = JSON.parse(localStorage.getItem('attempted') || '[]') as boolean[];
        const savedSelectedAnswers = JSON.parse(localStorage.getItem('selectedAnswers') || '{}') as SelectedAnswers;
        setAttempted(savedAttempted.length ? savedAttempted : new Array(testQuestions.length).fill(false));
        setSelectedAnswers(savedSelectedAnswers);
    }, []);

    useEffect(() => {
        localStorage.setItem('attempted', JSON.stringify(attempted));
        localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers));
    }, [attempted, selectedAnswers]);

    useEffect(() => {
        if (timer <= 300 && !alertShown) {
            alert("You have 5 minutes remaining!");
            setAlertShown(true);
        }
    }, [timer, alertShown]);

    const submitReport = useCallback(() => {
        alert('Submitting the exam...');
        setLoading(true);

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
            };
        });

        const totalMarks = report.reduce((count, item) => (item.isCorrect ? count + 1 : count), 0);

        // Logging result to the console (instead of submitting to Firestore)
        console.log('Exam Results:', {
            totalMarks,
            report,
        });

        setLoading(false);

        window.close();

    }, [questions, selectedAnswers]);

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

    if (loading) return <Loader />;

    return (
        <div className="exam-started">
            <div className="content">
                <div className="question-container">
                    <div className="quiz">
                        <div className="quiz-header">
                            <h2>Examination</h2>
                            <div className="timer">Time Left: <span>{formatTime(timer)}</span></div>
                        </div>

                        {questions.length > 0 && (
                            <>
                                <div className="question">
                                    <h3>
                                        {currentIndex + 1}.{" "}
                                        {questions[currentIndex].question.split('\n').map((line, index) => (
                                            <span key={index}>
                                                {line}
                                                {index < questions[currentIndex].question.split('\n').length - 1 && <br />}
                                            </span>
                                        ))}
                                    </h3>
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
                                        onClick={() => handleNavigation(-1)}
                                        isDisabled={currentIndex === 0}
                                    />
                                    <Button
                                        type="button"
                                        title="Next Question"
                                        onClick={() => handleNavigation(1)}
                                        isDisabled={currentIndex === questions.length - 1}
                                    />
                                </div>
                                <Button type="button" title="Submit Exam" onClick={() => submitReport()} />
                                <CheckInternet />
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="question-list">
                <div className="listing">
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

export default ExaminationDemoExam;

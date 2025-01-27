import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import Button from '../../components/Buttons/Button';
import { saveAs } from 'file-saver';
import Loader from '../../components/Loader/Loader';

// Define types
type ResultDetail = {
    questionIndex: number;
    topic: string;
    chosenAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
};

type TopicDetail = {
    questions: ResultDetail[];
    totalMarks: number;
};

type UserResult = {
    email: string;
    name: string;
    details: ResultDetail[];
    totalMarks: number;
    level: string;
    timestamp: string;
    detailsByTopic?: { [key: string]: TopicDetail };
    startTime?: string;
    endTime?: string;
};

const fetchResultsFromCollection = async (collectionName: string): Promise<UserResult[]> => {
    const collectionRef = collection(firestore, collectionName);
    const snapshot = await getDocs(collectionRef);

    const userResultsMap = new Map<string, UserResult>();

    snapshot.forEach(doc => {
        const data = doc.data();
        const email = doc.id;

        if (!userResultsMap.has(email)) {
            userResultsMap.set(email, {
                email,
                name: data.name || 'No Name Provided',
                details: data.details || [],
                totalMarks: data.totalMarks || 0,
                level: data.level,
                timestamp: data.timestamp || new Date().toISOString(),
                startTime: data.startTime,
                endTime: data.endTime
            });
        } else {
            const userResult = userResultsMap.get(email)!;
            userResult.details = userResult.details.concat(data.details || []);
        }
    });

    return Array.from(userResultsMap.values()).map(userResult => {
        const groupedByTopic = userResult.details.reduce((acc, detail) => {
            if (!acc[detail.topic]) {
                acc[detail.topic] = { questions: [], totalMarks: 0 };
            }
            acc[detail.topic].questions.push({
                questionIndex: detail.questionIndex,
                topic: detail.topic, // Ensure topic is included
                chosenAnswer: detail.chosenAnswer || 'No Answer Selected',
                correctAnswer: detail.correctAnswer,
                isCorrect: detail.isCorrect
            });

            if (detail.isCorrect) acc[detail.topic].totalMarks++;

            return acc;
        }, {} as { [key: string]: TopicDetail });

        return { ...userResult, detailsByTopic: groupedByTopic };
    });
};

const ExamResults = () => {
    const [s24Results, setS24Results] = useState<UserResult[]>([]);
    const [m24Results, setM24Results] = useState<UserResult[]>([]);
    const [p25Results, setp25Results] = useState<UserResult[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const s24Data = await fetchResultsFromCollection('s24Result');
                const m24Data = await fetchResultsFromCollection('m24Result');
                const p25Data = await fetchResultsFromCollection('p25Result');

                setS24Results(s24Data);
                setM24Results(m24Data);
                setp25Results(p25Data)
            } catch (error) {
                console.error('Error fetching results from Firestore:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    const calculateTimeTaken = (startTime?: string, endTime?: string) => {
        if (startTime && endTime) {
            const duration = new Date(endTime).getTime() - new Date(startTime).getTime();
            const minutes = String(Math.floor(duration / 60000)).padStart(2, '0');
            const seconds = String(Math.floor((duration % 60000) / 1000)).padStart(2, '0');
            return `${minutes} Min ${seconds} Sec`;
        }
        return 'N/A';
    };

    const getAllTopics = (results: UserResult[]) => {
        return Array.from(new Set(results.flatMap(user => Object.keys(user.detailsByTopic || {}))));
    };

    const jsonToCSV = (data: UserResult[]) => {
        const headers = [
            'Name', 'Email', 'Start Time', 'End Time', 'Time Taken', 'Total Marks','level', ...getAllTopics(data)
        ];

        const csvRows = [];
        csvRows.push(headers.join(','));

        data.forEach(user => {
            const row = [
                user.name,
                user.email,
                user.startTime ? new Date(user.startTime).toLocaleTimeString() : 'N/A',
                user.endTime ? new Date(user.endTime).toLocaleTimeString() : 'N/A',
                calculateTimeTaken(user.startTime, user.endTime),
                user.totalMarks,
                user.level,
                ...getAllTopics(data).map(topic => user.detailsByTopic?.[topic]?.totalMarks || 0)
            ];
            csvRows.push(row.map(value => `"${value}"`).join(','));
        });

        return csvRows.join('\n');
    };

    const exportToCSV = () => {
        const csvData = jsonToCSV([...s24Results, ...m24Results, ...p25Results]);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'Exam_Results.csv');
    };

    const renderTable = (results: UserResult[], collectionName: string) => {
        const allTopics = getAllTopics(results);

        return (
            <>
                <h2 className='flex'>{collectionName} Results ({results.length}) 
                <Button type='button' title='Export to CSV' onClick={exportToCSV}/></h2>
                <div className='table-wrapper'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Name</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Time Taken</th>
                                <th>Level</th>
                                <th>Total Marks</th>
                                {allTopics.map(topic => (
                                    <th key={topic}>{topic}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((userResult, index) => (
                                <tr key={index}>
                                    <td>{userResult.email}</td>
                                    <td>{userResult.name}</td>
                                    <td>{userResult.startTime ? new Date(userResult.startTime).toLocaleTimeString() : 'N/A'}</td>
                                    <td>{userResult.endTime ? new Date(userResult.endTime).toLocaleTimeString() : 'N/A'}</td>
                                    <td>{calculateTimeTaken(userResult.startTime, userResult.endTime)}</td>
                                    <td>{userResult.level || 'NA'}</td>
                                    <td>{userResult.totalMarks}</td>
                                    {allTopics.map(topic => {
                                        const topicDetails = userResult.detailsByTopic?.[topic];
                                        const totalMarks = topicDetails ? topicDetails.totalMarks : 0;

                                        return (
                                            <td key={topic}>
                                                {totalMarks}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            {renderTable(s24Results, 'S24')}
            {renderTable(m24Results, 'M24')}
            {renderTable(p25Results, 'P25')}
        </div>
    );
};

export default ExamResults;

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';

// Define types
type ResultDetail = {
    questionIndex: number;
    topic: string;
    chosenAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
};

type TopicDetail = {
    questions: {
        questionIndex: number;
        chosenAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
    }[];
    totalMarks: number;
};

type UserResult = {
    email: string;
    name: string;
    timeTaken: string;
    details: ResultDetail[];
    totalMarks: number;
    timestamp: string;
    detailsByTopic?: { [key: string]: TopicDetail }; // Optional for transformed results
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
                timeTaken: data.timeTaken || 'No Time Recorded',
                details: [],
                totalMarks: data.totalMarks || 0,
                timestamp: data.timestamp || new Date().toISOString(),
            });
        }

        const userResult = userResultsMap.get(email)!;
        userResult.details = userResult.details.concat(data.details || []);
    });

    return Array.from(userResultsMap.values()).map(userResult => {
        const groupedByTopic = userResult.details.reduce((acc, detail) => {
            if (!acc[detail.topic]) {
                acc[detail.topic] = {
                    questions: [],
                    totalMarks: 0
                };
            }
            acc[detail.topic].questions.push({
                questionIndex: detail.questionIndex,
                chosenAnswer: detail.chosenAnswer || 'No Answer Selected',
                correctAnswer: detail.correctAnswer,
                isCorrect: detail.isCorrect
            });

            if (detail.isCorrect) acc[detail.topic].totalMarks++;

            return acc;
        }, {} as { [key: string]: TopicDetail });

        return {
            ...userResult,
            detailsByTopic: groupedByTopic
        };
    });
};

const ExamResults = () => {
    const [s24Results, setS24Results] = useState<UserResult[]>([]);
    const [m24Results, setM24Results] = useState<UserResult[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const s24Data = await fetchResultsFromCollection('s24Result');
                const m24Data = await fetchResultsFromCollection('m24Result');

                setS24Results(s24Data);
                setM24Results(m24Data);
            } catch (error) {
                console.error('Error fetching results from Firestore:', error);
            }
        };

        fetchResults();
    }, []);

    const getAllTopics = (results: UserResult[]) => {
        return Array.from(new Set(results.flatMap(user => Object.keys(user.detailsByTopic || {}))));
    };

    const renderTable = (results: UserResult[], collectionName: string) => {
        const allTopics = getAllTopics(results);

        return (
            <div className='table-wrapper'>
                <h2>{collectionName} Results</h2>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Time Taken</th>
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
                                <td>{userResult.timeTaken} Min</td>
                                <td>{userResult.totalMarks}</td>
                                {allTopics.map(topic => {
                                    const topicDetails = userResult.detailsByTopic?.[topic];
                                    const totalMarks = topicDetails ? topicDetails.totalMarks : 0;

                                    return (
                                        <td key={topic}>
                                            {topicDetails ? (
                                                <div>
                                                    {totalMarks}
                                                </div>
                                            ) : 'No Data'}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div>
            {renderTable(s24Results, 'S24')}
            {renderTable(m24Results, 'M24')}
        </div>
    );
};

export default ExamResults;

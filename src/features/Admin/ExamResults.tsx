import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../utils/firebase'; // Ensure this path is correct

interface ResultDetail {
    questionIndex: number;
    topic: string;
    chosenAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    name: string;
}

interface UserResult {
    email: string;
    details: ResultDetail[];
    totalMarks: number;
    timestamp: string;
}

const ExamResults = () => {
    const [results, setResults] = useState<Map<string, UserResult>>(() => new Map());
    const [userResults, setUserResults] = useState<any[]>([]);

    useEffect(() => {
        const fetchAllS24Results = async () => {
            try {
                // Reference to the s24Result collection
                const s24ResultCollectionRef = collection(firestore, 'm24Result');
                const s24ResultSnapshot = await getDocs(s24ResultCollectionRef);

                // Process the results and group by email
                const userResultsMap = new Map<string, UserResult>();
                s24ResultSnapshot.forEach(doc => {
                    const data = doc.data();
                    const email = doc.id; // User's email is the document ID

                    if (!userResultsMap.has(email)) {
                        userResultsMap.set(email, {
                            email,
                            details: [],
                            totalMarks: data.totalMarks || 0,
                            timestamp: data.timestamp || new Date().toISOString(),
                        });
                    }

                    const userResult = userResultsMap.get(email)!;
                    userResult.details = userResult.details.concat(data.details || []);
                });

                // Set the results in the state
                setResults(userResultsMap);

                // Transform data to group by user and include topics
                const transformedResults = Array.from(userResultsMap.values()).map(userResult => {
                    const groupedByTopic = userResult.details.reduce((acc, detail) => {
                        if (!acc[detail.topic]) {
                            acc[detail.topic] = {
                                chosenAnswers: [],
                                correctAnswers: [],
                                isCorrectCount: 0
                            };
                        }
                        acc[detail.topic].chosenAnswers.push(detail.chosenAnswer || 'No Answer Selected');
                        acc[detail.topic].correctAnswers.push(detail.correctAnswer);
                        if (detail.isCorrect) acc[detail.topic].isCorrectCount++;

                        return acc;
                    }, {} as { [key: string]: { chosenAnswers: string[], correctAnswers: string[], isCorrectCount: number } });

                    return {
                        email: userResult.email,
                        totalMarks: userResult.totalMarks,
                        detailsByTopic: groupedByTopic
                    };
                });

                setUserResults(transformedResults);
            } catch (error) {
                console.error('Error fetching s24Result data from Firestore:', error);
            }
        };

        fetchAllS24Results();
    }, []);

    // Get unique topics across all results for table headers
    const allTopics = Array.from(new Set(userResults.flatMap(user => Object.keys(user.detailsByTopic))));

    return (
        <div>
            <h1>Exam Results</h1>
            <div className='table-wrapper'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Total Marks</th>
                            {allTopics.map(topic => (
                                <th key={topic}>{topic}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {userResults.map((userResult, index) => (
                            <tr key={index}>
                                <td>{userResult.email}</td>
                                <td>{userResult.totalMarks}</td>
                                {allTopics.map(topic => {
                                    const topicDetails = userResult.detailsByTopic[topic];
                                    return (
                                        <td key={topic}>
                                            {topicDetails
                                                ? `Chosen: ${topicDetails.chosenAnswers.join('; ')} | Correct: ${topicDetails.correctAnswers.join('; ')} | Correct Count: ${topicDetails.isCorrectCount}`
                                                : 'No Data'}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExamResults;

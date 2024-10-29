import { useEffect, useState } from 'react';
import Banner from '../../../assets/banner.png';
import { fetchUserRegistrationDate } from '../../../utils/firebaseUtils'; // Adjust the path as necessary

const TARGET_DATE = new Date('2024-09-21T17:00:00');
const OLYMPIAD_B_DATE = new Date('2024-10-19T17:00:00');
const COMPARE_DATE = new Date('2024-09-30T00:00:00');
const formatDateTime = (date: any) => {
    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true // Use 12-hour format
    });
};
const AboutOlympiad = () => {
    const [displayDate, setDisplayDate] = useState<Date | null>(null);

    useEffect(() => {
        const userEmail = JSON.parse(localStorage.getItem('olympd_prefix') || '{}')?.email;
        if (userEmail) {
            fetchUserRegistrationDate(userEmail)
                .then(date => {
                    const finalDate = date && date < COMPARE_DATE ? TARGET_DATE : OLYMPIAD_B_DATE;
                    setDisplayDate(finalDate);
                })
                .catch(error => console.error("Error fetching user data:", error));
        } else {
            console.warn('No email found in local storage.');
            setDisplayDate(OLYMPIAD_B_DATE); // Default to Olympiad B date if no email
        }
    }, []);

    if (!displayDate) {
        return <div>Loading...</div>; // Loading state while fetching the date
    }

    return (
        <div className='content'>
            <h2>About the Olympiad Math 2024</h2>
            <div className='olympiad-banner'>
                <img src={Banner} alt="Olympiad Banner" />
            </div>
            <h3>About</h3>
            <div className='faq'>
                <details>
                    <summary>A Two-Phase Olympiad for a Comprehensive Assessment</summary>
                    <p><strong>This Olympiad is divided into 2 phases:</strong></p>
                    <p><strong>Phase 1: The Instructional Proficiency Test</strong></p>
                    <ul className='list'>
                    <li>Date: {formatDateTime(displayDate)}</li>
                        <li>Format: Multiple Choice Questions</li>
                        <li>No. of Questions: 30</li>
                        <li>Exam Duration: 40 Minutes</li>
                        <li>Time: 5 PM</li>
                        <li>Mode: Online</li>
                        <li>Participation: Open to all Educators</li>
                        <li>Date of Result: 25 October, 2024</li>
                        <li>Outcome:
                            <span>The Top 200 scorers will advance to the Maths Educator Excellence Award</span>
                        </li>
                        <li>Rewards for All the Participants:
                            <span>Certificate of Participation (who attempt the exam)</span>
                            <span>Olympiad Excellence Report</span>
                            <span>8 Expert-Led Live Training Sessions</span>
                        </li>
                    </ul>
                    <p><strong>Phase 2: Maths Educator Excellence Award</strong></p>
                    <ul className='list'>
                        <li><strong>Task:</strong> Submission of a Lesson Plan using Innovative Teaching Practices in Math Education, and a video of 3-5 minutes explaining the lesson.</li>
                        <li><strong>Participation:</strong> Top 200 scorers will be eligible for participation</li>
                        <li><strong>Last date of Submission:</strong> 11 November, 2024</li>
                        <li><strong>Evaluation:</strong> By a Team of National Awardee Teachers and Top Mathematics Educators in India.</li>
                        <li><strong>Goal:</strong> To highlight creativity, active engagement, and innovative practices (specific to math education) in lesson planning.</li>
                        <li><strong>Result:</strong> 30th November, 2024</li>
                        <li>Rewards for all the selected participants:
                            <span>Certificate of Achievements</span>
                            <span>Access to India’s First AI Portal for Educators</span>
                            <span>100% Scholarships for Google Educators Exam Fee Level 2 Worth Rs.2500</span>
                        </li>
                        <li>Rewards for the Top 3 Winners:
                            <span>Cash prize of ₹ 50,000 each</span>
                        </li>
                    </ul>
                </details>
                <details>
                    <summary>Curriculum</summary>
                    <p>Any teacher or aspirant would feel at ease while taking this Olympiad test. The topics covered are commonly known to Math Educators. Nevertheless, it's a good idea to review your basics and stay updated with the latest teaching methods to boost your chances of achieving a top rank in the exam.</p>
                    <p><strong>Topics Covered:</strong></p>
                    <ul className='list'>
                        <li>Pedagogical Knowledge</li>
                        <li>Innovative Teaching Strategies</li>
                        <li>Technology Integration</li>
                        <li>Classroom Management</li>
                        <li>Assessment and Evaluation</li>
                        <li>Professional Development</li>
                        <li>Real-world Applications</li>
                        <li>Inclusive Mathematics Education</li>
                        <li>Cross-Disciplinary Integration</li>
                        <li>Student Engagement and Differentiated Instruction</li>
                    </ul>
                </details>
                <details>
                    <summary>Sample Papers</summary>
                    <p><strong>Check the Sample Paper as per the Grade you have selected</strong></p>
                    <h3>Sample Paper for Grade 1 to 5</h3>
                    <a href=''>PDF attachment</a>
                    <h3>Sample Paper for Grade 6 to 10</h3>
                    <a href=''>PDF attachment</a>
                    <h3>Sample Paper for Grade 11 and above</h3>
                    <a href=''>PDF attachment</a>
                </details>
                <details>
                    <summary>Process of Attempting the Olympiad</summary>
                    <p><strong>Accessing the Olympiad:</strong></p>
                    <p>1 day before the exam's scheduled start, we will send a dedicated link for the Olympiad on your registered email id. Please ensure you check the email on time to access the link and read all the instructions. Once the link is live, simply click on 'Start Test' button in the mail to begin your Olympiad journey.</p>
                    <p><strong>Exam Environment and Integrity:</strong></p>
                    <p>The Olympiad will be conducted in a secure online environment. To maintain the integrity of the exam:</p>
                    <ul className='list'>
                        <li>Webcam Monitoring: Your participation will be monitored via webcam throughout the exam duration. This is to ensure a fair and honest testing environment for all participants.</li>
                        <li>Zero Tolerance for Malpractice: Any form of malpractice, if detected, will lead to immediate disqualification. We uphold the highest standards of integrity and expect the same from our participants.</li>
                    </ul>
                    <p><strong>Pre-Exam Checklist:</strong></p>
                    <p>To ensure a smooth and uninterrupted exam experience, please verify the following before the exam begins:</p>
                    <ul className='list'>
                        <li><strong>Stable Internet Connection:</strong> Confirm that you have a reliable and active internet connection. It’s advisable to use a wired connection if possible, to reduce the risk of connectivity issues.</li>
                        <li><strong>Functional Webcam:</strong> Ensure your webcam is working properly. The exam platform will require continuous access to your webcam to monitor the exam process.</li>
                        <li><strong>Quiet and Well-Lit Space:</strong> Choose a quiet area with good lighting for taking the exam. This helps in clear visibility for webcam monitoring and minimizes distractions.</li>
                        <li><strong>Compatible Browser:</strong> Check that you are using a compatible web browser. Further details will be sent in Exam mail.</li>
                        <li><strong>System Test:</strong> Check your System compatibility 1 day before the exam from the Exam mail.</li>
                    </ul>
                    <p><strong>Technical Support:</strong></p>
                    <p>If you encounter any technical issues during the exam, please contact our support team immediately using the contact details provided in the Exam mail.</p>
                </details>
            </div>
        </div>
    );
};

export default AboutOlympiad;

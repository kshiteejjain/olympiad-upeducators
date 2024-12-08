import { useEffect, useState } from 'react';
import Banner from '../../../assets/english-banner.png';
import { fetchUserRegistrationDate } from '../../../utils/firebaseUtils'; // Adjust the path as necessary
import Loader from '../../../components/Loader/Loader';

const TARGET_DATE = new Date('2025-02-15T17:00:00');
const OLYMPIAD_B_DATE = new Date('2025-02-15T17:00:00');
const COMPARE_DATE = new Date('2024-09-30T00:00:00');

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
        return <Loader />; // Loading state while fetching the date
    }

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

    return (
        <div className='content'>
            <h2>About the Olympiad</h2>
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
                        <li>Time: 5 PM IST</li>
                        <li>Mode: Online</li>
                        <li>Participation: Open to all Educators</li>
                        <li>Date of Result: 22nd March, 2025</li>
                        <li>Outcome:
                            <span>The Top 200 scorers will advance to the English Educator Excellence Award</span>
                        </li>
                        <li>Rewards for All the Participants:
                            <span>Certificate of Participation (who attempts the exam)</span>
                            <span>Olympiad Competency Report</span>
                            <span>8 Expert-Led Live Training Sessions</span>
                        </li>
                    </ul>
                    <p><strong>Phase 2: English Educator Excellence Award</strong></p>
                    <ul className='list'>
                        <li>Task: Submission of a Lesson Plan using Innovative Language Teaching Practices, and a video of 3-5 minutes explaining the lesson.</li>
                        <li>Participation: Top 200 scorers will be eligible for participation</li>
                        <li>Last date of Submission: 6th April, 2025</li>
                        <li>Evaluation: By a Team of National Awardee Teachers and Top English Educators in India.</li>
                        <li>Goal: To highlight creativity, active engagement, and innovative practices (specific to English education) in lesson planning.</li>
                        <li>Result: 19th April, 2025</li>
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
                    <p>Any teacher or aspirant would feel at ease while taking this Olympiad test. The topics covered are commonly known to English Educators. Nevertheless, reviewing your basics and staying updated with the latest teaching methods is a good idea to boost your chances of achieving a top rank in the exam.</p>
                    <p><strong>Topics Covered:</strong></p>
                    <ul className='list'>
                        <li>Pedagogical Knowledge</li>
                        <li>Innovative Teaching Strategies</li>
                        <li>Technology Integration in Language Learning</li>
                        <li>Language and Literacy Development</li>
                        <li>Inclusive Education and Special Needs</li>
                        <li>Classroom Management and Differentiated Language Teaching</li>
                        <li>Cross-Disciplinary Integration and Real-world Applications</li>
                        <li>Student Engagement</li>
                        <li>Assessment and Evaluation</li>
                        <li>Professional Development and Ethics</li>
                    </ul>
                </details>
                <details>
                    <summary>Sample Papers</summary>
                    <p><strong>Sample Papers will updated by 15th December 2024</strong></p>
                    {/* <h3>View the Sample Paper with the link below:</h3>
                    <a href='https://drive.google.com/file/d/1lng8wtXd0gUtNJ7dgFX9dLyLcDeWR6Qs/view?pli=1' target='_blank'>View Sample Paper</a> */}
                </details>
                <details>
                    <summary>Process of Attempting the Olympiad</summary>
                    <p><strong>Accessing the Olympiad:</strong></p>
                    <ul className='list'>
                        <li>Open Olympiad Portal 1 day before your scheduled exam.</li>
                        <li> Click 'Exam Corner' {'>'} 'Check Demo Exam' to verify your camera, microphone, and familiarize yourself with the interface to ensure a smooth experience during the main exam.</li>
                        <li>Please read all the instructions carefully and conduct a System check.</li>
                        <li>At the exam time, click 'Exam Corner' {'>'} 'Start Exam' to begin</li>
                    </ul>
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
                    <p><strong>IMPORTANT INSTRUCTIONS:</strong></p>
                    <ul className='list'>
                        <li>Don’t click/switch outside the exam window during the exam</li>
                        <li>Keep a Govt-issued ID card ready before exam (Driving License, Passport, Aadhar etc.)</li>
                        <li>Make sure your system doesn't get disconnected.</li>
                        <li>In case of power outage or net disconnection or any other interruption, upEducators isn't responsible</li>
                        <li>This exam can only be taken on a Windows Laptop or PC.</li>
                        <li>Ensure your device date and time are correct.</li>
                    </ul>
                    <p><strong>For Queries:</strong></p>
                    <p>If you have any query before the Exam, please write an email to <a href='mailto:olympiad@upeducators.com'>olympiad@upeducators.com</a> and our team will get back to you within 24 working hours.</p>
                    <p><strong>Technical Support:</strong></p>
                    <p>If you encounter any technical issues during the exam, please contact our support team immediately at <strong>+919870980678</strong> or <strong>+919595011824</strong></p>
                </details>
            </div>
        </div>
    );
};

export default AboutOlympiad;

import { useEffect, useState } from 'react';
import Banner from '../../../assets/primary-banner.png';
import Primary_2_Banner from '../../../assets/primary_2-olympiad-image.jpg';
import { fetchUserRegistrationDate } from '../../../utils/firebaseUtils';
import Loader from '../../../components/Loader/Loader';

const TARGET_DATE = new Date('2025-02-01T17:00:00');
const OLYMPIAD_B_DATE = new Date('2025-03-08T17:00:00');
const COMPARE_DATE = new Date('2025-02-01T00:00:00');

const AboutOlympiad = () => {
    const [displayDate, setDisplayDate] = useState<Date | null>(null);
    const [bannerSrc, setBannerSrc] = useState('');

    useEffect(() => {
        const userEmail = JSON.parse(localStorage.getItem('olympd_prefix') || '{}')?.email;
        if (userEmail) {
            fetchUserRegistrationDate(userEmail)
                .then(date => {
                    const finalDate = date && date < COMPARE_DATE ? TARGET_DATE : OLYMPIAD_B_DATE;
                    setDisplayDate(finalDate);
                    setBannerSrc(date < COMPARE_DATE ? Banner : Primary_2_Banner)
                    console.log('user registered', date < COMPARE_DATE)
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
                <img src={bannerSrc} alt="Olympiad Banner" />
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
                        <li>No. of Questions: 40</li>
                        <li>Exam Duration: 50 Minutes</li>
                        <li>Time: 5 PM IST</li>
                        <li>Mode: Online</li>
                        <li>Participation: Open to all Educators</li>
                        <li>Date of Result: 11th March, 2025</li>
                        <li>Outcome:
                            <span>The Top 200 scorers will advance to the Primary Educator Excellence Award</span>
                        </li>
                        <li>Rewards for All the Participants:
                            <span>Certificate of Participation (who attempt the exam)</span>
                            <span>Olympiad Excellence Report</span>
                            <span>8 Expert-Led Live Training Sessions</span>
                        </li>
                    </ul>
                    <p><strong>Phase 2: Primary Educator Excellence Award</strong></p>
                    <ul className='list'>
                        <li>Task: Submission of a Lesson Plan using Innovative Teaching Practices, and a video of 3-5 minutes explaining the lesson.</li>
                        <li>Participation: Top 200 scorers will be eligible for participation</li>
                        <li>Last date of Submission: 13th April, 2025</li>
                        <li>Goal: To highlight creativity, active engagement, and innovative practices in lesson planning.</li>
                        <li>Result: 03rd May, 2025</li>
                        <li>Rewards for all the selected participants:
                            <span>Certificate of Achievements</span>
                            <span>Access to India’s First AI Portal for Educators</span>
                            <span>100% Scholarships for Google Educators Exam Fee Level 2 Worth Rs.2500</span>
                        </li>
                        <li>Rewards for the Top 3 Winners:
                            <span>Winner: Cash prize of ₹50,000 or $600</span>
                            <span>1st Runner up: Cash prize of ₹25,000 or $300</span>
                            <span>2nd Runner up: Cash prize of ₹10,000 or $120</span>
                        </li>
                    </ul>
                </details>
                <details>
                    <summary>Curriculum</summary>
                    <p>The exam aims to evaluate educators' comprehensive understanding and practical application of essential concepts in primary education. It serves as a platform for educators to showcase their teaching skills, critical thinking, and problem-solving abilities. The topics covered are relevant to primary education, and the questions will not be specific to any particular grade or subject.</p>
                    <p><strong>Topics Covered:</strong></p>
                    <ul className='list'>
                        <li> Child Development and Psychology</li>
                        <li>Primary Education Theories and Pedagogy</li>
                        <li>Lesson Planning, Assessment, and Feedback</li>
                        <li>Innovative Teaching Strategies and Student Engagement </li>
                        <li>Real-world Applications and Cross-Disciplinary Integration</li>
                        <li>Technology Integration in the Classroom</li>
                        <li>Classroom Management and Differentiated Instruction</li>
                        <li>Inclusive Education and Special Needs</li>
                        <li>Professional Development and Ethics</li>
                        <li>Parental Engagement and Community Involvement</li>
                    </ul>
                </details>
                <details>
                    <summary>Sample Papers</summary>
                    <p><strong>Check the Sample Paper as per the Grade you have selected</strong></p>
                    <h3>View the Sample Paper with the link below:</h3>
                    <a href='https://drive.google.com/file/d/1343LH9Xf5WsulbVvx1VCr7BZ1azpcejD/view?usp=sharing' target='_blank'>View Sample Paper</a>
                </details>
                <details>
                    <summary>Process of Attempting the Olympiad</summary>
                    <p><strong>Accessing the Olympiad:</strong></p>
                    <ul className='list'>
                        <li>Open Olympiad Portal 1 day before your scheduled exam.</li>
                        <li> Click 'Exam Corner' {'>'} 'Check Demo Exam' to verify your camera, microphone, and familiarize yourself with the interface to ensure a smooth experience during the main exam.</li>
                        <li>Please read all the instructions carefully and conduct a System check.</li>
                        <li>At the exam time, click 'Exam Corner' {'>'} 'Start Final Exam' to begin</li>
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

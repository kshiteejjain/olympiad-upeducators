import Banner from '../../../assets/science-olympiad-image.jpg';

const AboutOlympiad = () => {
    
    return (
        <div className="content">
            <h2>About the Olympiad</h2>
            <div className="olympiad-banner">
                <img src={Banner} alt="Olympiad Banner" />
            </div>
            <h3>About</h3>
            <div className="faq">
                <details>
                    <summary>A Two-Phase Olympiad for a Comprehensive Assessment</summary>
                    <p>
                        <strong>This Olympiad is divided into 2 phases:</strong>
                    </p>
                    <p>
                        <strong>Phase 1: The Instructional Proficiency Test</strong>
                    </p>
                    <ul className="list">
                        <li>Date: 26/04/2025</li>
                        <li>Format: Multiple Choice Questions</li>
                        <li>No. of Questions: 30</li>
                        <li>Exam Duration: 40 Minutes</li>
                        <li>Time: 5 PM IST</li>
                        <li>Mode: Online</li>
                        <li>Participation: Open to all Educators</li>
                        <li>Date of Result: 3 June, 2025</li>
                        <li>
                            Outcome:
                            <span>
                                The Top 200 scorers will advance to the Science Educator Excellence Award
                            </span>
                        </li>
                        <li>
                            Rewards for All the Participants:
                            <span>Certificate of Participation (who attempt the exam)</span>
                            <span>Olympiad Excellence Report</span>
                            <span>8 Expert-Led Live Training Sessions</span>
                        </li>
                    </ul>
                    <p>
                        <strong>Phase 2: Science Educator Excellence Award</strong>
                    </p>
                    <ul className="list">
                        <li>
                            Task: Submission of a Lesson Plan using Innovative Teaching Practices in Science Education, and a video of 3-5 minutes explaining the lesson.
                        </li>
                        <li>Participation: Top 200 scorers will be eligible for participation</li>
                        <li>Last date of Submission: 6 July, 2025</li>
                        <li>Evaluation: By a Team of National Awardee Teachers and Top Science Educators in India.</li>
                        <li>
                            Goal: To highlight creativity, active engagement, and innovative practices (specific to science education) in lesson planning.
                        </li>
                        <li>Result: 26th July, 2025</li>
                        <li>
                            Rewards for all the selected participants:
                            <span>Certificate of Achievements</span>
                            <span>Access to India’s First AI Portal for Educators</span>
                            <span>100% Scholarships for Google Educators Exam Fee Level 2 Worth Rs.2500</span>
                        </li>
                        <li>
                            Rewards for the Top 3 Winners:
                            <span>Cash prize of ₹ 35,000 each</span>
                        </li>
                    </ul>
                </details>
                <details>
                    <summary>Curriculum</summary>
                    <p>
                        Any teacher or aspirant would feel at ease while taking this Olympiad test. The topics covered are commonly known to Science Educators. Nevertheless, it's a good idea to review your basics and stay updated with the latest teaching methods to boost your chances of achieving a top rank in the exam.
                    </p>
                    <p>
                        <strong>Topics Covered:</strong>
                    </p>
                    <ul className="list">
                        <li>Science Instruction and Pedagogy</li>
                        <li>Innovative Teaching Strategies</li>
                        <li>Classroom Management</li>
                        <li>Digital Tool Integration</li>
                        <li>Cognitive Development and Learning</li>
                        <li>STEM Integration and Real-world Applications</li>
                        <li>Inclusive Education and Special Needs</li>
                        <li>Student Engagement and Differentiated Instruction</li>
                        <li>Assessment and Evaluation</li>
                        <li>Professional Development and Ethics</li>
                    </ul>
                </details>
                <details>
                    <summary>Sample Papers</summary>
                    <p>
                        <strong>Sample Papers will be updated by 25th February, 2025</strong>
                    </p>
                </details>
                <details>
                    <summary>Process of Attempting the Olympiad</summary>
                    <p>
                        <strong>Accessing the Olympiad:</strong>
                    </p>
                    <p>1 day before the exam's scheduled start, we will send a dedicated link for the Olympiad on your registered email id. Please ensure you check the email on time to access the link and read all the instructions. Once the link is live, simply click on 'Start Final Test' button in the mail to begin your Olympiad journey.</p>
                    <p>
                        <strong>Exam Environment and Integrity:</strong>
                    </p>
                    <p>The Olympiad will be conducted in a secure online environment. To maintain the integrity of the exam:</p>
                    <ul className="list">
                        <li>Webcam Monitoring: Your participation will be monitored via webcam throughout the exam duration. This is to ensure a fair and honest testing environment for all participants.</li>
                        <li>Zero Tolerance for Malpractice: Any form of malpractice, if detected, will lead to immediate disqualification. We uphold the highest standards of integrity and expect the same from our participants.</li>
                    </ul>
                    <p>
                        <strong>Pre-Exam Checklist:</strong>
                    </p>
                    <p>To ensure a smooth and uninterrupted exam experience, please verify the following before the exam begins:</p>

                    <ul className="list">
                        <li>
                            Stable Internet Connection: Confirm that you have a reliable and active internet connection. It’s advisable to use a wired connection if possible, to reduce the risk of connectivity issues. </li>
                        <li>Functional Webcam: Ensure your webcam is working properly. The exam platform will require continuous access to your webcam to monitor the exam process.</li>
                        <li>Quiet and Well-Lit Space: Choose a quiet area with good lighting for taking the exam. This helps in clear visibility for webcam monitoring and minimizes distractions.</li>
                        <li>Compatible Browser: Check that you are using a compatible web browser. Further details will be sent in Exam mail.</li>
                        <li>System Test: Check your System compatibility 1 day before the exam from the Exam mail.
                        </li>
                    </ul>

                    <p>
                        <strong>Technical Support:</strong>
                    </p>
                    <p>
                        If you encounter any technical issues during the exam, please contact our support team immediately using the contact details provided in the Exam mail.
                    </p>
                </details>
            </div>
        </div>
    );
};

export default AboutOlympiad;

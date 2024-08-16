import ChevronDown from '../../../assets/chevron-down.svg';

const FAQ = () => {
    const scrollToSection = (id: any) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className='content'>
            <h2>Frequently Asked Questions</h2>
            <div className='faq-topics'>
                <h2>Categories</h2>
                <a href='javascript:void(0)' onClick={() => scrollToSection('about-the-olympiad')}>About the Olympiad <img src={ChevronDown} alt="Chevron Down" /> </a>
                <a href='javascript:void(0)' onClick={() => scrollToSection('registration')}>Registration <img src={ChevronDown} alt="Chevron Down" /></a>
                <a href='javascript:void(0)' onClick={() => scrollToSection('exam-preparation')}>Exam & Preparation <img src={ChevronDown} alt="Chevron Down" /></a>
                <a href='javascript:void(0)' onClick={() => scrollToSection('eligibility')}>Eligibility <img src={ChevronDown} alt="Chevron Down" /></a>
                <a href='javascript:void(0)' onClick={() => scrollToSection('live-masterclasses')}>Live Masterclasses <img src={ChevronDown} alt="Chevron Down" /></a>
            </div>
            <div className='faq' id='about-the-olympiad'>
                <h3>About the Olympiad</h3>
                <details>
                    <summary>Who is organizing this International Maths Teachers’ Olympiad?</summary>
                    <p>upEducators, a distinguished Google For Education Partner Company, is proudly organizing this Maths Teachers’ Olympiad. We are dedicated to empowering educators with innovative teaching methodologies and achieving excellence. For more insights into our mission and initiatives, please <a href="https://www.upeducators.com/about" target='_blank' rel="noopener noreferrer">click here.</a></p>
                </details>
            </div>
            <div className='faq' id='registration'>
                <h3>Registration</h3>
                <details>
                    <summary>What is the process after I register myself?</summary>
                    <p>You will get the Learning Management System (LMS) access on your registered email within 1 working day. You have to check the Email on Laptop/PC and NOT ON MOBILE. You need to sign up on LMS from the mail and you will get all the further details there.</p>
                </details>
                <details>
                    <summary>Can I cancel my registration or request for a refund?</summary>
                    <p>We do not offer cancellations or refunds under any circumstances. Once registration is completed, it is considered final, and refunds or cancellations cannot be processed. We advise reviewing all details before confirming your registration to avoid any inconvenience.</p>
                </details>
                <details>
                    <summary>How can I get support if I have any queries?</summary>
                    <p>Please mail your query to olympiad@upeducators.com and you will get a reply in your mail within 2 working days.</p>
                </details>
                <details>
                    <summary>Can I change the Registered Email id?</summary>
                    <p>You need to mail at olympiad@upeducators.com before 31st August 2024 along with the payment receipt. After the deadline, your details will not be changed in any case.</p>
                </details>
            </div>
            <div className='faq' id='exam-preparation'>
                <h3>Exam & Preparation</h3>
                <details>
                    <summary>What kind of preparation is required for the Olympiad?</summary>
                    <p>No special preparation is required for this Olympiad. The competition is structured to assess and celebrate your dedication and creativity in early childhood education. It's an opportunity to showcase your knowledge, pedagogical skills, critical thinking, and problem-solving abilities. However, familiarity with the key concepts and best practices in Pre-primary education will be beneficial.</p>
                </details>
                <details>
                    <summary>Where can I attempt this test?</summary>
                    <p>You can attempt this test from your Windows Desktop or Laptop with working webcam.</p>
                </details>
                <details>
                    <summary>Can I attempt this Exam from my Mobile?</summary>
                    <p>No, this Exam can be given only from a Windows Laptop/PC with a functional webcam.</p>
                </details>
                <details>
                    <summary>Will I get sample questions for the Olympiad preparation?</summary>
                    <p>Yes, you will get sample questions once you register for the Olympiad.</p>
                </details>
                <details>
                    <summary>Will I be getting any certificate?</summary>
                    <p>Yes, all the participants will be getting an International Certificate of Participation. Top performers will also get a Certificate of Achievement.</p>
                </details>
                <details>
                    <summary>What if I am not available at the Exam time, can Exam date/time be changed?</summary>
                    <p>Exam date and time will not be changed in any circumstances and also no refund will be provided.</p>
                </details>
                <details>
                    <summary>How the Top 3 Winners will be Decided?</summary>
                    <ul className='list'>
                        <li>All the Participants will attempt the Olympiad exam (Phase 1).</li>
                        <li>Top 200 participants will then get selected for Maths Educator Excellence Award. The selected educators need to submit a Lesson Plan using Innovative Teaching Practices in Mathematics Education and a video of 3-5 minutes explaining the lesson.</li>
                        <li>The submitted Lesson plan will be evaluated by a Team of National Awardee Teachers and Top Mathematics Educators in India.</li>
                        <li>After the evaluation, One winner will be selected from each grade level (Eg. Grade 1 to 5, Grade 6 to 10, Grade 11 and above)</li>
                        <li>Each winner will receive a cash prize of Rs. 50,000.</li>
                    </ul>
                </details>
            </div>
            <div className='faq' id='eligibility'>
                <h3>Eligibility</h3>
                <details>
                    <summary>Who can participate in this Olympiad?</summary>
                    <p>The International Maths Teachers’ Olympiad welcomes a diverse range of educators to participate. Whether you're an aspiring teacher just starting your journey, a current in-service teacher actively engaged in the profession, or a retired educator with years of valuable experience, you are eligible to join this global event.</p>
                </details>
                <details>
                    <summary>Which subject teachers can participate in this International Maths Teachers’ Olympiad?</summary>
                    <p>The International Maths Teachers’ Olympiad is open to all teachers having an understanding of mathematical concepts and pedagogy.</p>
                </details>
            </div>
            <div className='faq' id='live-masterclasses'>
                <h3>Live Masterclasses</h3>
                <details>
                    <summary>Will I have to pay additional fees for attending the Live Training Sessions?</summary>
                    <p>No additional fee payments are required for attending the Live Training Sessions.
                        These enriching educational experiences are included in the Registration Fee of Rs. 369/- without any hidden or extra charges.</p>
                </details>
                <details>
                    <summary>When will I get the Masterclasses?</summary>
                    <p>Masterclasses will be conducted after the Result.</p>
                </details>
            </div>
        </div>
    );
};

export default FAQ;

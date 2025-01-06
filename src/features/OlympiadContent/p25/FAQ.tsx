import React, { useState, FC } from 'react';
import ChevronDown from '../../../assets/chevron-down.svg';

// Define types for FAQ and question
type Question = {
    summary: string;
    answer: string | JSX.Element;
};

type FAQItem = {
    id: string;
    title: string;
    questions: Question[];
};

const FAQ: FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const faqs: FAQItem[] = [
        {
            id: 'about-the-olympiad',
            title: 'About the Olympiad',
            questions: [
                {
                    summary: 'Who is organizing this International Primary Teachers’ Olympiad?',
                    answer: (
                        <>
                            upEducators, a distinguished Google For Education Partner Company, is proudly organizing this Pre-Primary Teachers’ Olympiad. We are dedicated to empowering educators with innovative teaching methodologies and achieving excellence. For more insights into our mission and initiatives, please <a href="https://www.upeducators.com" target="_blank" rel="noopener noreferrer">click here</a>.
                        </>
                    ),
                },
            ],
        },
        {
            id: 'registration',
            title: 'Registration',
            questions: [
                {
                    summary: 'Can I cancel my registration or request for a refund?',
                    answer: 'We do not offer cancellations or refunds under any circumstances. Once registration is completed, it is considered final, and refunds or cancellations cannot be processed. We advise reviewing all details before confirming your registration to avoid any inconvenience.',
                },
                {
                    summary: 'How can I get support if I have any queries?',
                    answer: 'Please mail your query to olympiad@upeducators.com and you will get a reply in your mail within 2 working days.',
                },
                {
                    summary: 'Can I change the Registered Email id?',
                    answer: 'You need to mail at olympiad@upeducators.com before 25th December 2024 along with the payment receipt. After the deadline, your details will not be changed in any case.',
                }
            ],
        },
        {
            id: 'exam-preparation',
            title: 'Exam & Preparation',
            questions: [
                {
                    summary: 'How to prepare for this Olympiad?',
                    answer: 'No special preparation is required for this Olympiad. The competition is structured to assess and celebrate your dedication and creativity in primary education. It"s an opportunity to showcase your knowledge, pedagogical skills, critical thinking, and problem-solving abilities. However, familiarity with the key concepts and best practices in education will be beneficial. And for more idea on what kind of questions will come in the Olympiad exam, please refer to sample questions available in this Olympiad portal.',
                },
                {
                    summary: 'Where can I attempt this test?',
                    answer: 'You can attempt this test on your Windows Desktop or Laptop with a working webcam.',
                },
                {
                    summary: 'Can I attempt this Exam from my Mobile?',
                    answer: 'No, this exam can be given only on a Windows Laptop or Desktop with a functional webcam.',
                },
                {
                    summary: 'Will I get sample questions for the Olympiad preparation?',
                    answer: 'Yes, sample questions are already uploaded in this Olympiad Portal under the “About Olympiad” section.',
                },
                {
                    summary: 'Will I be getting any certificate?',
                    answer: 'Yes, all the participants will be getting an International Certificate of Participation. Top performers will also get a Certificate of Achievement.',
                },
                {
                    summary: 'What if I am not available at the Exam time, can Exam date/time be changed?',
                    answer: 'Exam date and time will not be changed in any circumstances and also no refund will be provided.',
                }
            ],
        },
        {
            id: 'live-masterclasses',
            title: 'Live Masterclasses',
            questions: [
                {
                    summary: 'Will I have to pay additional fees for attending the Live Training Sessions?',
                    answer: 'No additional fee payments are required for attending the Live Training Sessions. These enriching educational experiences are included in the Registration Fee of Rs. 369/- without any hidden or extra charges.',
                },
                {
                    summary: 'When will I get the Masterclasses?',
                    answer: 'Masterclasses will be conducted after the Result.',
                },
                {
                    summary: 'Will I get the Certificate for the Masterclasses?',
                    answer: 'Yes, you will be getting the Certificate of Participation for each Masterclass for the Masterclass you attend Live.',
                },
            ],
        },
    ];

    const extractTextFromAnswer = (answer: string | JSX.Element): string => {
        if (typeof answer === 'string') {
            return answer.toLowerCase();
        }
        if (React.isValidElement(answer)) {
            // Type assertion to indicate answer is a React element
            const element = answer as React.ReactElement;

            return React.Children.toArray(element.props.children)
                .filter((child): child is string => typeof child === 'string') // Type guard
                .map(child => child.toLowerCase())
                .join(' ')
                .trim();
        }
        return ''; // Return an empty string if it's neither
    };

    const filteredFAQs = faqs.filter(faq =>
        faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.questions.some(q =>
            q.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            extractTextFromAnswer(q.answer).includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div className='content'>
            <h2>Frequently Asked Questions</h2>
            <div className='faq-topics gradient'>
                <h2>Categories</h2>
                <input
                    type="search"
                    placeholder="Search here..."
                    className='form-control'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <a href="#about-the-olympiad" onClick={(e) => { e.preventDefault(); scrollToSection('about-the-olympiad'); }}>
                    About the Olympiad <img src={ChevronDown} alt="Chevron Down" />
                </a>
                <a href="#registration" onClick={(e) => { e.preventDefault(); scrollToSection('registration'); }}>
                    Registration <img src={ChevronDown} alt="Chevron Down" />
                </a>
                <a href="#exam-preparation" onClick={(e) => { e.preventDefault(); scrollToSection('exam-preparation'); }}>
                    Exam & Preparation <img src={ChevronDown} alt="Chevron Down" />
                </a>
                <a href="#live-masterclasses" onClick={(e) => { e.preventDefault(); scrollToSection('live-masterclasses'); }}>
                    Live Masterclasses <img src={ChevronDown} alt="Chevron Down" />
                </a>
            </div>
            {filteredFAQs.map(faq => (
                <div className='faq' key={faq.id} id={faq.id}>
                    <h3>{faq.title}</h3>
                    {faq.questions.map((question, index) => (
                        <details key={index}>
                            <summary>{question.summary}</summary>
                            <p>{question.answer}</p>
                        </details>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default FAQ;

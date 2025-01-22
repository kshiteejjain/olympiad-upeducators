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
            id: 'registration',
            title: 'Registration',
            questions: [
                {
                    summary: 'Can I cancel my registration or request for a refund?',
                    answer: 'We do not offer cancellations or refunds under any circumstances. Once registration is completed, it is considered final, and refunds or cancellations cannot be processed. We advise you to review all the details before confirming your registration to avoid any inconvenience.',
                },
                {
                    summary: 'How can I get support if I have any queries?',
                    answer: 'Please mail your query to olympiad@upeducators.com and you will get a reply on your mail within 2 working days.',
                },
                {
                    summary: 'Can I change the Registered Email ID?',
                    answer: 'You need to mail to olympiad@upeducators.com before 25th January 2025 along with the payment receipt. After the deadline, your details will not be changed in any case.',
                }
            ],
        },
        {
            id: 'exam-preparation',
            title: 'Exam & Preparation',
            questions: [
                {
                    summary: 'What kind of preparation is required for the Olympiad?',
                    answer: 'No special preparation is required for this Olympiad. The competition is designed to evaluate your existing knowledge, teaching methodologies, and ability to foster language and communication skills in learners. However, familiarity with key concepts, best practices in English education, and innovative strategies for language teaching will be advantageous.',
                },
                {
                    summary: 'Will I get sample questions for the Olympiad preparation?',
                    answer: 'Yes, you will get sample questions once you register for the Olympiad.',
                },
                {
                    summary: 'What if I am not available at the exam time, can the exam date/time be changed?',
                    answer: 'The exam date and time will not be changed in any circumstances and also no refund will be provided.',
                },
                {
                    summary: 'Where can I attempt this test?',
                    answer: 'You can attempt this test on your Windows Desktop or Laptop with a working webcam.',
                },
                {
                    summary: 'Can I attempt this exam on my mobile?',
                    answer: 'No, this exam can be given only on a Windows Laptop or Desktop with a functional webcam.',
                },
                {
                    summary: 'Will I be getting any certificate?',
                    answer: 'Yes, all the participants will be getting an International Certificate of Participation. Top performers will also get a Certificate of Achievement.',
                },
                {
                    summary: 'How the Top 3 Winners will be Decided?',
                    answer: 'All the Participants will be attempting the Olympiad exam (Phase 1). The top 200 participants will then be selected for the English Educator Excellence Award. The selected educators need to submit a Lesson Plan using Innovative Language Teaching Practices and a video of 3-5 minutes explaining the lesson. The submitted Lesson plan will be evaluated by a Team of National Awardee Teachers and Top English Educators in India. After the evaluation, one winner will be selected from each grade level category (Eg. Grade 1 to 5, Grade 6 to 10, Grade 11 and above). Each winner will receive a cash prize of Rs. 50,000.',
                }
            ],
        },
        {
            id: 'live-masterclasses',
            title: 'Live Masterclasses',
            questions: [
                {
                    summary: 'Will I have to pay additional fees for attending the Live Training Sessions?',
                    answer: 'No additional fee payments are required for attending the Live Training Sessions. These enriching educational experiences are included in the Registration Fee of Rs. 379/- without any hidden or extra charges.',
                },
                {
                    summary: 'When will I get the Masterclasses?',
                    answer: 'Masterclasses will be conducted after the result announcement.',
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

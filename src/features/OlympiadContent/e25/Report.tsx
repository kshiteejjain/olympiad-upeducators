import reportImg1 from '/src/assets/Overall-Performance.png';
import reportImg2 from '/src/assets/Strengths-Gaps.png';
import reportImg3 from '/src/assets/insight.png';

const SessionsData = [
    {
        name: 'Assess your Overall Performance',
        image: reportImg1 // Use imported image
    },
    {
        name: 'Discover your strengths and gaps',
        image: reportImg2 // Use imported image
    },
    {
        name: 'Track progress with detailed insights',
        image: reportImg3 // Use imported image
    }
];

const CoursesCard = () => {
    return (
        SessionsData.map((item, index) => (
            <div className='card coursesCard' key={index}>
                <img src={item.image} alt='' />
                <div className='details'>
                    <h4>{item.name}</h4>
                </div>
            </div>
        ))
    );
};

const Report = () => {
    return (
        <div className='content'>
            <h2>Report</h2>
            <div className='flex-card'>
                <CoursesCard />
            </div>
            <p>At upEducators, we recognize the pivotal role of English teachers in shaping young minds. Following the International English Teachers’ Olympiad, we are committed to providing each participant with a detailed Olympiad Competency Report. This report is not just a reflection of your performance in the Olympiad; it's a roadmap for your ongoing professional journey in English Education.</p>
            <p><strong>What the Competency Report Entails:</strong></p>
            <p>Your personalized Competency Report will offer a comprehensive evaluation across diverse, crucial parameters. It’s designed to highlight your strengths and identify potential areas for growth, empowering you to achieve excellence in English Education.</p>
            <p><strong>Key Evaluation Parameters:</strong></p>

            <p><strong>Pedagogical Knowledge:</strong> Deep understanding of English language teaching theories, methodologies, and practices that enhance student communication skills and language proficiency.</p>

            <p><strong>Innovative Teaching Strategies:</strong> Ability to design and implement creative and effective strategies that improve language learning, encourage critical thinking, and foster creativity in students of diverse abilities.</p>

            <p><strong>Technology Integration in Language Learning:</strong> Proficiency in utilizing digital tools and platforms to enhance English instruction, promote interactive learning, and prepare students for a technology-driven world.</p>

            <p><strong>Language and Literacy Development:</strong> Expertise in developing students' listening, speaking, reading, and writing skills, fostering a strong foundation in literacy and communication.</p>

            <p><strong>Inclusive Education and Special Needs:</strong> Skill in adapting teaching practices to accommodate diverse learners, including those with special needs, ensuring an inclusive and supportive learning environment.</p>

            <p><strong>Classroom Management and Differentiated Language Teaching:</strong> Capability to create a positive and engaging classroom atmosphere that encourages participation, supports differentiated instruction, and addresses individual student needs.</p>

            <p><strong>Cross-Disciplinary Integration and Real-world Applications:</strong> Ability to integrate English teaching with other subject areas and real-world scenarios, enhancing relevance, critical thinking, and holistic learning.</p>

            <p><strong>Student Engagement:</strong> Proficiency in designing activities and strategies that capture students’ interest, promote active participation, and sustain motivation in language learning.</p>

            <p><strong>Assessment and Evaluation:</strong> Competence in creating and implementing diverse assessment methods to measure language skills and literacy development accurately.</p>

            <p><strong>Professional Development and Ethics:</strong> Commitment to continuous learning, ethical teaching practices, and staying updated with the latest trends, research, and innovations in English language education.</p>

        </div>
    );
};

export default Report;

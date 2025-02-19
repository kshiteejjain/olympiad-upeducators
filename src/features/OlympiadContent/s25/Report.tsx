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
            <p>At upEducators, we recognize the pivotal role that teachers play in shaping young minds and fostering a culture of learning. Following the International Teachers’ Olympiad, we are committed to providing each participant with a detailed Olympiad Excellence Report.</p>
            <p>This report is more than just a reflection of your Olympiad performance—it serves as a personalized roadmap for your professional growth, helping you refine your teaching strategies and enhance student learning outcomes.</p>
            <p><strong>What the Excellence Report Entails:</strong></p>
            <p>Your Excellence Report offers a comprehensive evaluation across key professional parameters. It highlights your strengths and identifies opportunities for development, equipping you with insights to excel in your teaching journey..</p>

            <p><strong>Key Evaluation Parameters:</strong></p>
            <p><strong>Pedagogical Knowledge:</strong> Understanding of subject-specific teaching theories, methodologies, and best practices to enhance student comprehension and engagement.</p>

            <p><strong>Innovative Teaching Strategies:</strong> Ability to implement creative and effective teaching methods that improve student understanding, critical thinking, and problem-solving skills.</p>

            <p><strong>Technology Integration:</strong> Proficiency in utilizing digital tools and platforms to enrich instruction, promote interactive learning, and prepare students for a technology-driven world.</p>

            <p><strong>Classroom Management:</strong> Skill in creating a positive and engaging learning environment that fosters curiosity, participation, and effective discipline.</p>

            <p><strong>Assessment and Evaluation:</strong> Competence in designing and implementing diverse assessment strategies to accurately measure student comprehension, skills, and progress.</p>

            <p><strong>Professional Development:</strong> Commitment to continuous learning and staying updated with the latest trends, research, and best practices in education.</p>

            <p><strong>Real-world Applications:</strong> Capacity to connect subject matter with practical, everyday situations, enhancing student engagement and demonstrating relevance.</p>

            <p><strong>Inclusive Education:</strong> Expertise in adapting teaching methods to accommodate diverse learning needs, ensuring equal access to quality education for all students.</p>

            <p><strong>Cross-Disciplinary Integration:</strong> Ability to incorporate subject-specific concepts into other disciplines, promoting holistic learning and demonstrating real-world applicability.</p>

            <p><strong>Student Engagement and Differentiated Instruction:</strong> Skill in tailoring instruction to individual student needs, interests, and learning styles while maintaining high levels of engagement across the classroom.</p>

        </div>
    );
};

export default Report;

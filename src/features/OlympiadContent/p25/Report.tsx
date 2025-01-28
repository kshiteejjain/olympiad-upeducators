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
            <p>At upEducators, we recognize Primary Teachers' vital role in shaping young minds and building their futures. Following the International Primary Teachers’ Olympiad, we are committed to providing each participant with a detailed Olympiad Excellence Report. This report goes beyond just assessing your performance—it serves as a strategic guide for your ongoing professional growth and success in primary education.</p>
            <p><strong>What the Olympiad Excellence Report Entails:</strong></p>
            <p>Your personalized competency report will provide an in-depth assessment across diverse and crucial parameters. It’s designed to highlight your strengths and identify potential areas for growth, enabling you to excel as a Primary Educator.</p>
            <p><strong>Key Evaluation Parameters:</strong></p>
            <p>Child Development and Psychology: Comprehensive understanding of children's developmental stages and psychological principles to create a supportive and effective learning environment.</p>

<p><strong>Primary Education Theories and Pedagogy:</strong> Exhibits a strong grasp of key educational theories and can employ diverse pedagogical approaches to address varied learning styles.</p>

<p><strong>Lesson Planning, Assessment, and Feedback:</strong> Ability to design coherent lesson plans aligned with curriculum standards, utilize diverse assessment methods, and provide constructive feedback to support student growth.</p>

<p><strong>Innovative Teaching Strategies and Student Engagement:</strong> Competence in integrating creative teaching techniques that make learning interactive and enjoyable, fostering high levels of student motivation and participation.</p>

<p><strong>Real-world Applications and Cross-Disciplinary Integration:</strong> Capacity to connect academic concepts to practical scenarios and incorporate interdisciplinary approaches, enhancing students' holistic understanding of subjects.</p>

<p><strong>Technology Integration in the Classroom:</strong> Proficiency in utilizing digital tools and resources to enrich the learning experience and ability to prepare students for a technology-driven future.</p>

<p><strong>Classroom Management and Differentiated Instruction:</strong> Ability to maintain a positive, organized classroom environment and adapt instruction to meet diverse student needs, ensuring every learner can thrive.</p>

<p><strong>Inclusive Education and Special Needs:</strong> Can effectively implement inclusive teaching practices and develop strategies to support students with special needs, ensuring equitable access to quality education for all.</p>

<p><strong>Professional Development and Ethics:</strong> Demonstrates commitment to continuous learning and upholds high ethical standards, fostering trust and integrity within the educational community.</p>

<p><strong>Parental Engagement and Community Involvement:</strong> Deep understanding of how to build strong partnerships with parents and leverage community resources to enhance the educational experience and support student learning.</p>
        </div>
    );
};

export default Report;

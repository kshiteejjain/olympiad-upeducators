const SessionsData = [{
    name: 'Gamification in Education: Making Learning Fun and Effective',
    duration: '2 hours live workshop',
    image: 'https://www.upeducators.com/wp-content/uploads/2022/08/google-certified-educators-homepage.jpg'
},
{
    name: 'Innovative Math Teaching: Incorporating STEP and Robotics',
    duration: '2 hours live workshop',
    image: 'https://www.upeducators.com/wp-content/uploads/2022/08/microsft-certified-educators-homepage1.jpg'
},
{
    name: 'Transforming Math Education with Artificial intelligence',
    duration: '2 hours live workshop',
    image: 'https://www.upeducators.com/wp-content/uploads/2022/10/gc-trainer-5761.jpg'
},
{
    name: 'Project Based Learning in Mathematics',
    duration: '2 hours live workshop',
    image: 'https://www.upeducators.com/wp-content/uploads/2022/10/online-teaching-5761.jpg'
}];

const CoursesCard = () => {
    return (
        SessionsData.map((item, index) => (
            <div className='card coursesCard' key={index}>
                <img src={item.image} alt='' />
                <div className='details'>
                    <h4>{item.name}</h4>
                    <p className='duration'>{item.duration}</p>
                </div>
            </div>
        ))
    )
}

const Report = () => {
    return (
        <div className='content'>
            <h2>Report</h2>
            <div className='flex-card'>
                <CoursesCard />
            </div>
            <p>At upEducators, we recognize the pivotal role of Math teachers in shaping young minds. Following the <strong>International Maths Teachers’ Olympiad</strong>, we are committed to providing each participant with a detailed Olympiad Excellence Report. This report is not just a reflection of your performance in the Olympiad; it's a roadmap for your ongoing professional journey in Math Education.</p>
            <p><strong>What the Excellence Report Entails:</strong></p>
            <p>Your personalized Excellence Report will offer a comprehensive evaluation across diverse, crucial parameters. It’s designed to highlight your strengths and identify potential areas for growth, empowering you to achieve excellence in Math Education.</p>
            <p><strong>Key Evaluation Parameters:</strong></p>
            <p>Pedagogical Knowledge:  Deep understanding of mathematics-specific teaching theories, methodologies and practices that facilitate effective teaching and enhance student learning outcomes.</p>

            <p><strong>Innovative Teaching Strategies:</strong> Ability to implement creative and effective methods that enhance mathematical understanding and problem-solving skills in students of varying abilities.</p>

            <p><strong>Technology Integration:</strong> Proficiency in utilizing digital tools and platforms to enrich mathematics instruction and prepare students for a technology-driven world.</p>

            <p><strong>Classroom Management:</strong> Skill in creating a positive learning environment that fosters mathematical exploration, encourages participation, and maintains discipline conducive to effective learning.</p>

            <p><strong>Assessment and Evaluation:</strong> Competence in designing and implementing diverse assessment methods to accurately measure mathematical comprehension, skills, and progress.</p>

            <p><strong>Professional Development:</strong> Commitment to continuous learning and staying updated with the latest trends, research, and best practices in mathematics education.</p>

            <p><strong>Real-world Applications:</strong> Capacity to connect mathematical concepts with practical, everyday situations, enhancing student engagement and demonstrating the relevance of mathematics.</p>

            <p><strong>Inclusive Mathematics Education:</strong> Expertise in adapting teaching methods to accommodate diverse learning needs, ensuring equal access to quality mathematics education for all students.</p>

            <p><strong>Cross-Disciplinary Integration:</strong> Ability to incorporate mathematical concepts into other subject areas, promoting holistic learning and demonstrating the universal applicability of mathematics.</p>

            <p><strong>Student Engagement and Differentiated Instruction:</strong> Skill in tailoring mathematical instruction to individual student needs, interests, and learning styles, while maintaining high levels of engagement across the classroom.</p>
        </div>
    )
};

export default Report;

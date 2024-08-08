import './AboutUpEducators.css';

const SessionsData = [{
    name: '4,00,000+ Followers on Social Media',
    duration: 'Join over 400,000 educators across India who are part of our vibrant social media community, benefiting from shared experiences and insights.',
    image: 'https://www.upeducators.com/wp-content/uploads/2022/08/google-certified-educators-homepage.jpg'
},
{
    name: 'Educators trained from 5000+ Schools & Colleges',
    duration: 'We"ve trained and instilled confidence in educators from more than 5,000 schools and colleges, including prestigious institutions.',
    image: 'https://www.upeducators.com/wp-content/uploads/2022/08/microsft-certified-educators-homepage1.jpg'
},
{
    name: 'Rated 4.9/5 by 2000+ Educators on Google Reviews',
    duration: 'Our commitment to quality is reflected in our near-perfect rating of 4.9 out of 5 on Google Reviews, based on feedback from over 2,000+ educators.',
    image: 'https://www.upeducators.com/wp-content/uploads/2022/10/gc-trainer-5761.jpg'
},
{
    name: '1200+ Certified Educators',
    duration: 'We have successfully guided over 1,200+ educators in achieving Google and Microsoft Educator Certifications, marking them as leaders in the field of digital education.',
    image: 'https://www.upeducators.com/wp-content/uploads/2022/10/online-teaching-5761.jpg'
}];

const AboutUpEducators = () => {
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
    return (
        <div className='content'>
            <h2>About UpEducators</h2>
            <p>upEducators is a beacon of innovation in the educational technology sector in India. Recognized as a Google For Education Partner, we stand at the forefront of empowering educators with the most advanced and practical digital pedagogy and innovative teaching practices. Our mission is to equip teachers with the necessary tools and knowledge to thrive in an ever-evolving educational landscape.</p>
            <p><strong>Our Impact:</strong></p>
            <div className='flex-card'>
                <CoursesCard />
            </div>
            <p><strong>A Thriving Community:</strong> Join over 400,000 educators across India who are part of our vibrant social media community, benefiting from shared experiences and insights.</p>

            <p><strong>Excellence in Training:</strong> We've trained and instilled confidence in educators from more than 5,000 schools and colleges, including prestigious institutions like Mayo Girls College, Symbiosis College Pune, Delhi Public School, and many more.</p>

            <p><strong>Highly Rated by Educators:</strong> Our commitment to quality is reflected in our near-perfect rating of 4.9 out of 5 on Google Reviews, based on feedback from over 1,800+ educators.</p>

            <p><strong>Certification Leaders:</strong> We have successfully guided over 1,200+ educators in achieving Google and Microsoft Educator Certifications, marking them as leaders in the field of digital education.</p>
        </div>
    )
};

export default AboutUpEducators;
import impactImg1 from '/src/assets/impact-img1.png';
import impactImg2 from '/src/assets/impact-img2.png';
import impactImg3 from '/src/assets/impact-img3.png';
import impactImg4 from '/src/assets/impact-img4.png';

const SessionsData = [
    {
        name: '4,00,000+ Followers on Social Media',
        duration: 'Join over 400,000 educators across India who are part of our vibrant social media community, benefiting from shared experiences and insights.',
        image: impactImg1 // Use imported image
    },
    {
        name: 'Educators trained from 8000+ Schools & Colleges',
        duration: 'We\'ve trained and instilled confidence in educators from more than 5,000 schools and colleges, including prestigious institutions.',
        image: impactImg2 // Use imported image
    },
    {
        name: 'Rated 4.9/5 by 2000+ Educators on Google Reviews',
        duration: 'Our commitment to quality is reflected in our near-perfect rating of 4.9 out of 5 on Google Reviews, based on feedback from over 2,000+ educators.',
        image: impactImg3 // Use imported image
    },
    {
        name: '1200+ Certified Educators',
        duration: 'We have successfully guided over 1,200+ educators in achieving Google and Microsoft Educator Certifications, marking them as leaders in the field of digital education.',
        image: impactImg4 // Use imported image
    }
];

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
        );
    }

    return (
        <div className='content'>
            <h2>About UpEducators</h2>
            <p>upEducators is a leader in educational technology in India. As a Google for Education Partner, we focus on helping teachers use the latest digital tools and teaching methods. Our goal is to give educators the skills and knowledge they need to succeed in today's changing education world.</p>
            <p><strong>Our Impact:</strong></p>
            <div className='flex-card'>
                <CoursesCard />
            </div>
            <p><strong>A Thriving Community:</strong> Join over 400,000 educators across India who are part of our vibrant social media community, benefiting from shared experiences and insights.</p>

            <p><strong>Excellence in Training:</strong> We've trained and instilled confidence in educators from more than 5,000 schools and colleges, including prestigious institutions like Mayo Girls College, Symbiosis College Pune, Delhi Public School, and many more.</p>

            <p><strong>Highly Rated by Educators:</strong> Our commitment to quality is reflected in our near-perfect rating of 4.9 out of 5 on Google Reviews, based on feedback from over 1,800+ educators.</p>

            <p><strong>Certification Leaders:</strong> We have successfully guided over 1,200+ educators in achieving Google and Microsoft Educator Certifications, marking them as leaders in the field of digital education.</p>
        </div>
    );
};

export default AboutUpEducators;

import impactImg1 from '/src/assets/Educators-trained-from-9000-Schools-Colleges.png';
import impactImg2 from '/src/assets/Trained-25000-Educators.png';
import impactImg3 from '/src/assets/Trained-Educators-from-30-Countries.png';
import impactImg4 from '/src/assets/400000-Followers-on-Social-Media.png';
import impactImg5 from '/src/assets/1200-Certified-Educators.png';
import impactImg6 from '/src/assets/Rated-4.9-by-2200-Educators-on-Google-Reviews.png';

const SessionsData = [
    {
        name: '4,00,000+ Followers on Social Media',
        duration: 'Join over 400,000 educators across India who are part of our vibrant social media community, benefiting from shared experiences and insights.',
        image: impactImg4 // Corrected to use the unique image for social media followers
    },
    {
        name: 'Educators trained from 9000+ Schools & Colleges',
        duration: 'We\'ve trained and instilled confidence in educators from more than 9,000 schools and colleges, including prestigious institutions.',
        image: impactImg1 // Corrected to use the image for trained educators from schools/colleges
    },
    {
        name: 'Rated 4.9/5 by 2200+ Educators on Google Reviews',
        duration: 'Our commitment to quality is reflected in our near-perfect rating of 4.9 out of 5 on Google Reviews, based on feedback from over 2,200+ educators.',
        image: impactImg6 // Corrected to use the image for Google Reviews rating
    },
    {
        name: '1200+ Certified Educators',
        duration: 'We have successfully guided over 1,200+ educators in achieving Google and Microsoft Educator Certifications, marking them as leaders in the field of digital education.',
        image: impactImg5 // Corrected to use the image for certified educators
    },
    {
        name: 'Trained 25000+ Educators',
        duration: 'We\'ve empowered over 25,000 educators with essential skills, fostering growth and excellence in classrooms across diverse regions.',
        image: impactImg2 // Corrected to use the image for trained educators (25,000+)
    },
    {
        name: 'Trained Educators from 30+ Countries',
        duration: 'Our training programs have reached educators in 30+ countries, promoting global teaching standards and supporting educators around the world in their professional growth.',
        image: impactImg3 // Corrected to use the image for trained educators from 30+ countries
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
            <h2>About upEducators</h2>
            <p>upEducators is a leader in educational technology in India. As a Google for Education Partner, we focus on helping teachers use the latest digital tools and teaching methods. Our goal is to give educators the skills and knowledge they need to succeed in today's changing education world.</p>
            <p><strong>Our Achievements:</strong></p>
            <div className='flex-card'>
                <CoursesCard />
            </div>
        </div>
    );
};

export default AboutUpEducators;

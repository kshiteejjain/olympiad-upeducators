import Button from "../../../components/Buttons/Button";

const sessionsData = [
    {
        name: 'Google Certified Educator Course',
        duration: 'Elevate Your Teaching with Digital Skills Certification',
        link: 'https://www.upeducators.com/google-certified-educator/',
        image: 'https://www.upeducators.com/wp-content/uploads/2022/08/google-certified-educators-homepage.jpg'
    },
    {
        name: 'Microsoft Certified Educator Course',
        duration: 'Best Career Advancement Certification for Educators in this Digital Age',
        link: 'https://www.upeducators.com/microsoft-certified-educators/',
        image: 'https://www.upeducators.com/wp-content/uploads/2022/08/microsft-certified-educators-homepage1.jpg'
    },
    {
        name: 'STEM Robotics Course',
        duration: 'A Course specifically designed for Maths, Science and ICT Teachers',
        link: 'https://www.upeducators.com/stem-robotics-course-for-educators/',
        image: 'https://www.upeducators.com/wp-content/uploads/2022/10/applied-digital-skills-5761.jpg'
    },
    {
        name: 'Innovative Teaching Practices Course',
        duration: 'With A Certification from Microsoft & ATHE, UK',
        link: 'https://www.upeducators.com/professional-certificate-in-innovative-teaching-practices/',
        image: 'https://www.upeducators.com/wp-content/uploads/2022/10/innovative-teaching-5761.jpg'
    },
    {
        name: 'Online Teaching Course',
        duration: 'Learn A to Z of Online Teaching with Google Certification',
        link: 'https://www.upeducators.com/professional-certificate-in-online-teaching/',
        image: 'https://www.upeducators.com/wp-content/uploads/2022/10/online-teaching-5761.jpg'
    },
    {
        name: 'Nursery Teachers Training Course',
        duration: 'With Dual Certification from Skill India and Google',
        link: 'https://www.upeducators.com/nursery-teachers-training/',
        image: '/src/assets/Nursery-Teachers-Training-Course.png'
    },
    {
        name: 'ECCEd Course',
        duration: 'Learn skills to excel in early childhood education',
        link: 'https://www.upeducators.com/ecced-course/',
        image: '/src/assets/ECCEd-course.png'
    },
    {
        name: 'Google Certified Trainer Course',
        duration: 'Make classrooms more efficient and foster leadership skills',
        link: 'https://www.upeducators.com/google-certified-trainer/',
        image: '/src/assets/google-certified-trainer.png'
    }
];

const CoursesForEducators = () => (
    <div className='content'>
        <h2>Courses for Educators</h2>
        <div className='flex-card'>
            {sessionsData.map(({ name, duration, link, image }, index) => (
                <div className='card coursesCard' key={index}>
                    <img src={image} alt={name} />
                    <div className='details'>
                        <h4>{name}</h4>
                        <p className='duration'>{duration}</p>
                        <Button type="button" title="View Course" onClick={() => window.open(link, '_blank')} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default CoursesForEducators;

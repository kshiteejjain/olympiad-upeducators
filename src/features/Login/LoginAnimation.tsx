import { useEffect, useState } from 'react';
import logo from '../../assets/Upeducator-logo.png';

type Props = {
    courses?: string[];
    delay?: number;
    isCarousal?: boolean;
  };
  
  const courseNames = [
    'A Google For Education Partner Company',
    'We offer Digital Marketing Course',
    'We offer Google Certified Educator Course',
    'We offer Microsoft Certified Educator Course',
    'We offer Coding & AI for Educators Course',
    'We offer STEM Robotics Course',
    'Trained 15,000+ Educators from 5000+ Schools and Colleges',
    '1000+ Google and Microsoft Certified Educators',
    'Join Community of 3,30,000+ Educators on Social Media',
  ];

  const CourseDisplay = ({ courses = [], delay = 2000 }: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % courses.length);
      }, delay);
  
      return () => clearInterval(intervalId);
    }, [courses.length, delay]);
  
    return <div className="course-display">{courses[currentIndex]}</div>;
  };

const LoginAnimation = ({isCarousal}: Props) => {
    return(
        <div className='branding'>
          <img src={logo} alt="Logo" />
          {isCarousal && <h2><CourseDisplay courses={courseNames} delay={5000} /></h2>}
        </div>
    )
};

export default LoginAnimation;
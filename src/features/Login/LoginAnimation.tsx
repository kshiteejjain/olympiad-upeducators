import { useEffect, useState } from 'react';
import logo from '../../assets/Upeducator-logo.png';

type Props = {
    courses?: string[];
    delay?: number;
    isCarousal?: boolean;
  };
  
  const courseNames = [
    "Welcome to International Teacher's Olympiad",
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
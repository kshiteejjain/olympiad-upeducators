import { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Loader from '../../components/Loader/Loader';
import logo from '../../assets/Upeducator-logo.png';
import './Login.css';

type Props = {
  courses?: string[];
  delay?: number;
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

const LoginWithEmail = lazy(() => import('./LoginWithEmail'));
const LoginWithPhone = lazy(() => import('./LoginWithPhone'));
const EnterOTP = lazy(() => import('./EnterOTP'));

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

const Login = () => {
  const [isPhoneLogin, setIsPhoneLogin] = useState(true);
  const [showEnterOTP, setShowEnterOTP] = useState(false);
  const [hasSessionId, setHasSessionId] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const olympdPrefix = localStorage.getItem('olympd_prefix');
    if (olympdPrefix) {
      try {
        const olympdData = JSON.parse(olympdPrefix);
        if (olympdData.sessionId) {
          setHasSessionId(true);
        }
        if (olympdData.code) {
          setShowEnterOTP(true);
        }
      } catch (error) {
        console.error('Failed to parse localStorage data:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (hasSessionId) {
      navigate('/AboutOlympiad'); // Redirect to AboutOlympiad
    }
  }, [hasSessionId, navigate]);

  const handleLoginToggle = () => {
    setIsPhoneLogin((prevState) => !prevState);
  };

  return (
    <div className="login-wrapper">
      <div className="login-visual"></div>
      <div className="login-form">
        <div className='branding'>
          <img src={logo} alt="Logo" />
          <h2><CourseDisplay courses={courseNames} delay={5000} /></h2>
        </div>
        <Suspense fallback={<Loader title='Loading...' />}>
          {showEnterOTP ? (
            <EnterOTP />
          ) : (
            isPhoneLogin ? <LoginWithPhone /> : <LoginWithEmail />
          )}
        </Suspense>
        <span className="login-option" onClick={handleLoginToggle}>
          {isPhoneLogin ? 'Login With Email?' : 'Login With Phone?'}
        </span>
      </div>
    </div>
  );
};

export default Login;

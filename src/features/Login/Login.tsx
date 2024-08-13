import { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Loader from '../../components/Loader/Loader';
import LoginAnimation from './LoginAnimation';

import './Login.css';

const LoginWithEmail = lazy(() => import('./LoginWithEmail'));
const LoginWithPhone = lazy(() => import('./LoginWithPhone'));

const Login = () => {
  const [isPhoneLogin, setIsPhoneLogin] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Check if localStorage has sessionId
    const olympdPrefix = localStorage.getItem('olympd_prefix');
    if (olympdPrefix) {
      try {
        const olympdData = JSON.parse(olympdPrefix);
        if (olympdData.sessionId) {
          navigate('/AboutOlympiad'); // Redirect to /AboutOlympiad
        }
      } catch (error) {
        console.error('Failed to parse localStorage data:', error);
      }
    }
  }, [navigate]);

  const handleLoginToggle = () => {
    // Remove olympdData.code from localStorage
    const olympdPrefix = localStorage.getItem('olympd_prefix');
    if (olympdPrefix) {
      try {
        const olympdData = JSON.parse(olympdPrefix);
        delete olympdData.code;
        localStorage.setItem('olympd_prefix', JSON.stringify(olympdData));
      } catch (error) {
        console.error('Failed to update localStorage data:', error);
      }
    }
    // Toggle between phone and email login
    setIsPhoneLogin((prevState) => !prevState);
  };

  return (
    <div className="login-wrapper">
      <div className="login-visual"></div>
      <div className="login-form">
        <LoginAnimation isCarousal />
        <Suspense fallback={<Loader title='Loading...' />}>
          {isPhoneLogin ? <LoginWithEmail /> : <LoginWithPhone />}
        </Suspense>
        <span className="login-option" onClick={handleLoginToggle}>
          {isPhoneLogin ? 'Login With Phone?' : 'Login With Email?'}
        </span>
      </div>
    </div>
  );
};

export default Login;

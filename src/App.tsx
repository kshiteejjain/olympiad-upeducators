import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PaymentGateway from './features/PaymentGateway/PaymentGateway';
import Login from './features/Login/Login';
import Header from './components/Header/Header';
import EnterOTP from './features/Login/EnterOTP';
import LMSForm from './features/LMSForm/LMSForm';
import Admin from './features/Admin/Admin';
import UserProfile from './features/UserProfile/UserProfile';
import AddUser from './features/AddUser/AddUser';
import DisplayContent from './features/DisplayContent/DisplayContent'

import './App.css';

const App = () => {
  const location = useLocation(); // Get the current route

  const checkSession = () => {
    const session = localStorage.getItem('olympd_prefix');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        return sessionData.sessionId === 'z5pxv6w2chzvkjjf0y64';
      } catch (error) {
        console.error('Failed to parse session data', error);
        return false;
      }
    }
    return false;
  };

  const showHeaderAndNav = checkSession();

  const noContainerRoutes = ['/', '/EnterOTP', '/LMSForm', '/ChangeEmail'];

  return (
    <div className="App">
      {showHeaderAndNav && <Header />}
      <div className={noContainerRoutes.includes(location.pathname) ? '' : 'container-wrapper'}>
        <Routes>
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/" element={<Login />} />
          <Route path="/LMSForm" element={<LMSForm />} />
          <Route path="/EnterOTP" element={<EnterOTP />} />
          <Route path="/AddUser" element={<AddUser />} />
          <Route path="/PaymentGateway" element={<PaymentGateway />} />
          <Route path="/DisplayContent" element={checkSession() ? <DisplayContent /> : <Navigate to="/" replace />} />
          <Route path="/Admin" element={checkSession() ? <Admin /> : <Navigate to="/" replace />} />
          <Route path="/UserProfile" element={checkSession() ? <UserProfile /> : <Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default () => (
  <Router>
    <App />
  </Router>
);

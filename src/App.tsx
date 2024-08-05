import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PaymentGateway from './features/PaymentGateway/PaymentGateway';
import AboutOlympiad from './features/AboutOlympiad/AboutOlympiad';
import ReferEarn from './features/ReferEarn/ReferEarn';
import Awards from './features/Awards/Awards';
import FAQ from './features/FAQ/FAQ';
import LiveMasterClass from './features/LiveMasterClass/LiveMasterClass';
import Report from './features/Report/Report';
import AboutUpEducators from './features/AboutUpEducators/AboutUpEducators';
import Login from './features/Login/Login';
import Header from './components/Header/Header';
import PageNavigation from './components/PageNavigation/PageNavigation';
import EnterOTP from './features/Login/EnterOTP';
import LMSForm from './features/LMSForm/LMSForm';
import Admin from './features/Admin/Admin';
import UserProfile from './features/UserProfile/UserProfile';

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

  const noContainerRoutes = ['/', '/EnterOTP', '/LMSForm'];

  return (
    <div className="App">
      {showHeaderAndNav && <Header />}
      <div className={noContainerRoutes.includes(location.pathname) ? '' : 'container-wrapper'}>
        {showHeaderAndNav && location.pathname !== '/LMSForm' && '/Admin' && <PageNavigation />}
        <Routes>
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/" element={<Login />} />
          <Route path="/LMSForm" element={<LMSForm />} />
          <Route path="/EnterOTP" element={<EnterOTP />} />
          <Route path="/PaymentGateway" element={<PaymentGateway />} />
          <Route path="/AboutOlympiad" element={checkSession() ? <AboutOlympiad /> : <Navigate to="/" replace />} />
          <Route path="/ReferEarn" element={checkSession() ? <ReferEarn /> : <Navigate to="/" replace />} />
          <Route path="/Awards" element={checkSession() ? <Awards /> : <Navigate to="/" replace />} />
          <Route path="/FAQ" element={checkSession() ? <FAQ /> : <Navigate to="/" replace />} />
          <Route path="/LiveMasterClass" element={checkSession() ? <LiveMasterClass /> : <Navigate to="/" replace />} />
          <Route path="/Report" element={checkSession() ? <Report /> : <Navigate to="/" replace />} />
          <Route path="/AboutUpEducators" element={checkSession() ? <AboutUpEducators /> : <Navigate to="/" replace />} />
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

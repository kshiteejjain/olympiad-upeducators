import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Upeducator-logo.png';
import PageNavigation from '../../features/PageNavigation/PageNavigation';
import Button from '../Buttons/Button';

import './Header.css';


const Header = () => {
  const [hasSessionId, setHasSessionId] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const olympd_prefix = localStorage.getItem('olympd_prefix');
    if (olympd_prefix) {
      const user = JSON.parse(olympd_prefix);
      if (user?.sessionId) {
        setHasSessionId(true);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('olympd_prefix');
    navigate('/login');
    window.location.reload()
  };

  return (
    <>
      <header className="header">
        <div className="container-wrapper">
          <img src={logo} alt='upEducator' title='upEducator' />
          {hasSessionId && <Button title={'Logout'} type='button' onClick={handleLogout} />}
        </div>
      </header>
      {hasSessionId && <PageNavigation />}
    </>
  );
};

export default Header;

import { useNavigate } from 'react-router-dom';
import Button from '../Buttons/Button';
import logo from '../../assets/Upeducator-logo.png';
import logout from '../../assets/logout.svg';
import ChevronDown from '../../assets/chevron-down.svg';

import './Header.css';


const Header = () => {
  const navigate = useNavigate();
  const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
  const isAdmin = olympdPrefix.email === 'kshiteejjain@gmail.com';

  const handleLogout = () => {
    localStorage.removeItem('olympd_prefix');
    navigate('/');
  };

  const checkSession = () => {
    const session = localStorage.getItem('olympd_prefix');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        alert(sessionData)
        return sessionData.sessionId === 'z5pxv6w2chzvkjjf0y64';
      } catch (error) {
        console.error('Failed to parse session data', error);
        return false;
      }
    }
    checkSession()
  };


  return (
    <>
      <header className="header">
        <div className="container-wrapper">
          <img src={logo} alt='upEducator' title='upEducator' className='logo' />
          <div className='header-right'>
            <div className='username'>Welcome <strong>{olympdPrefix.name} <img src={ChevronDown} className='arrow' /> </strong></div>
            <div className='dropdown-menu'>
              {isAdmin && <Button title='Admin' type='button' onClick={() => navigate('/Admin')} />}
              <Button title='Profile' type='button' onClick={() => navigate('/Profile')} />
              <Button title='Logout' type='button' onClick={handleLogout} isIcon iconPath={logout} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

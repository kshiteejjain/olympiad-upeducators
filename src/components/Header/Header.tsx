import { useNavigate } from 'react-router-dom';
import Button from '../Buttons/Button';
import logo from '../../assets/Upeducator-logo.png';
import logout from '../../assets/logout.svg';
import PlaceholderImage from '../../assets/profile-placeholder.png';

import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
  const isAdmin = olympdPrefix.email === 'ankushb@upeducators.com' || olympdPrefix.email === 'kshiteejjain@gmail.com';

  const handleLogout = () => {
    delete olympdPrefix?.sessionId;
    delete olympdPrefix?.email;
    delete olympdPrefix?.image
    delete olympdPrefix?.name
    localStorage.setItem('olympd_prefix', JSON.stringify(olympdPrefix));
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
          <button onClick={()=> navigate('/Examination')}>Examination</button>
          <div className='header-right'>
            <div className='username'>
              Welcome <strong>{olympdPrefix.name} </strong>
              {olympdPrefix.image ? <img className='profile-image' src={olympdPrefix?.image} /> : <img className='profile-image' src={PlaceholderImage} />}
            </div>
            <div className='dropdown-menu'>
              {isAdmin && <Button title='Admin' type='button' onClick={() => navigate('/Admin')} />}
              <Button title='Profile' type='button' onClick={() => navigate('/UserProfile')} />
              <Button title='Logout' type='button' onClick={handleLogout} isIcon iconPath={logout} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

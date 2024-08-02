import { useNavigate } from 'react-router-dom';
import PageNavigation from '../PageNavigation/PageNavigation';
import Button from '../Buttons/Button';
import logo from '../../assets/Upeducator-logo.png';
import logout from '../../assets/logout.svg';

import './Header.css';


const Header = () => {
  const navigate = useNavigate();
  const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('olympd_prefix');
    navigate('/');
    window.location.reload()
  };

  return (
    <>
      <header className="header">
        <div className="container-wrapper">
          <img src={logo} alt='upEducator' title='upEducator' />
          <div className='header-right'>
            <div className='username'>Welcome <strong>{olympdPrefix.name}</strong></div> 
            <Button title={'Logout'} type='button' isSecondary onClick={handleLogout} isIcon iconPath={logout} />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

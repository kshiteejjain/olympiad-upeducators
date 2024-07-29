import logo from '../../assets/Upeducator-logo.png';
import PageNavigation from '../../features/PageNavigation/PageNavigation';
import Button from '../Buttons/Button';

import './Header.css';
const Header = () => {

  return (
    <><header className="header">
      <div className="container-wrapper">
        <img src={logo} alt='upEducator' title='upEducator' />
        <Button title={'Logout'} type='button' />
      </div>
    </header><PageNavigation /></>
  );
};
export default Header;

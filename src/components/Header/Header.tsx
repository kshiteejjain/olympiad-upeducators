import logo from '../../assets/Upeducator-logo.png';

import './Header.css';
const Header = () => {

  return (
    <header className="header">
      <div className="container-wrapper">
        <img src={logo} alt='upEducator' title='upEducator' />
      </div>
    </header >
  );
};
export default Header;

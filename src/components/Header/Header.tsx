import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Buttons/Button';
import logo from '../../assets/Upeducator-logo.png';
import logout from '../../assets/logout.svg';
import PlaceholderImage from '../../assets/profile-placeholder.png';
import Loader from '../Loader/Loader';
import { fetchUserOlympiadData } from '../../utils/firebaseUtils'; // Import the utility function

import './Header.css';

type UserData = {
  olympiad?: string[];
  email?: string;
};

const Header = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoader, setIsLoader] = useState(false);
  const [selectedOlympiad, setSelectedOlympiad] = useState<string>('');
  const navigate = useNavigate();
  const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
  const isAdmin = olympdPrefix.email === 'ankushb@upeducators.com' || olympdPrefix.email === 'kshiteejjain@gmail.com';

  useEffect(() => {
    const fetchData = async () => {
      if (!olympdPrefix.email) return console.warn('No email found in olympd_prefix');

      setIsLoader(true);
      try {
        const usersData = await fetchUserOlympiadData(olympdPrefix.email);
        setUsers(usersData);

        const olympiads = Array.from(new Set(usersData.flatMap(user => user.olympiad || [])));
        if (olympiads.length > 0) {
          const storedOlympiad = olympdPrefix.olympiadName || olympiads[0];
          setSelectedOlympiad(storedOlympiad);

          // Update localStorage with the default or stored Olympiad
          const updatedOlympdPrefix = { ...olympdPrefix, };
          localStorage.setItem('olympd_prefix', JSON.stringify(updatedOlympdPrefix));
        }
      } catch (err) {
        alert('Error fetching registered olympiad name');
      } finally {
        setIsLoader(false);
      }
    };

    fetchData();
  }, [olympdPrefix.email]);

  const handleOlympiadChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newOlympiad = event.target.value;
    setSelectedOlympiad(newOlympiad);

    // Update localStorage
    const updatedOlympdPrefix = { ...olympdPrefix, olympiadName: newOlympiad };
    localStorage.setItem('olympd_prefix', JSON.stringify(updatedOlympdPrefix));
    window.location.reload();
  };

  const uniqueOlympiads = Array.from(new Set(users.flatMap(user => user.olympiad || [])));

  return (
    <>
      {isLoader && <Loader />}
      <header className="header">
        <div className="container-wrapper">
          <img src={logo} alt='upEducator' title='upEducator' className='logo' />
          <div className='language-option'>
            <Button type="button" isSecondary title="Dashboard" onClick={() => navigate('/')} />
            <select
              className='form-control'
              value={selectedOlympiad}
              onChange={handleOlympiadChange}
            >
              {uniqueOlympiads.map((olympiad, index) => {
                const olympiadLabel = olympiad === 's24' ? 'Science 2024' : olympiad === 'm24' ? 'Maths 2024' : olympiad;

                return (
                  <option key={index} value={olympiad}>
                    {olympiadLabel}
                  </option>
                );
              })}
            </select>
          </div>
          <div className='header-right'>
            <div className='username'>
              <strong>{olympdPrefix.name} </strong>
              <img className='profile-image' src={olympdPrefix.image || PlaceholderImage} alt='Profile' />
            </div>
            <div className='dropdown-menu'>
              {isAdmin && <Button title='Admin' type='button' onClick={() => navigate('/Admin')} />}
              <Button title='Profile' type='button' onClick={() => navigate('/UserProfile')} />
              <Button title='Logout' type='button' onClick={() => {
                localStorage.setItem('olympd_prefix', JSON.stringify({}));
                navigate('/');
              }} isIcon iconPath={logout} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

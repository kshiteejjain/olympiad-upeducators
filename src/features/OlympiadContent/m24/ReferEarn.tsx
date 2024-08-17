import { useState, useEffect, useCallback } from 'react';
import { firestore } from '../../../utils/firebase';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Loader from '../../../components/Loader/Loader';
import Button from '../../../components/Buttons/Button';
import Card from '../../../components/Card/Card';
import WhatsappIcon from '../../../assets/whatsapp.svg';
import CopyClipboard from '../../../assets/share.svg';
import invite from '../../../assets/invite.svg';
import withdraw from '../../../assets/withdraw.svg';
import tick from '../../../assets/tick.svg';
import Modal from '../../../components/Modal/Modal';

type User = {
  email: string;
  referral?: string;
  referrerUsers?: string[];
};

const ReferEarn = () => {
  const [referral, setReferral] = useState<string>('');
  const [hasReferral, setHasReferral] = useState<boolean>(false);
  const [referralUsers, setReferralUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);

  const referralData = `Hey! I am participating in the International Maths Teachers' Olympiad.
  It's a fantastic opportunity for us teachers to get feedback on our teaching skills and get recognition for it!!
  I found all the details in this video here: upeducators.com.
  If you like it too, you can use my referral link for a 10% discount. `;
  
  const domain = window.location.origin;

  const generateReferralCode = (): string => {
    return Math.random().toString(36).substring(2, 12);
  };

  const fetchUser = useCallback(async () => {
    const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
    const { email } = olympdPrefix;

    if (!email) {
      console.log('No logged in email found in localStorage.');
      return;
    }

    const userQuery = query(collection(firestore, 'OlympiadUsers'), where('email', '==', email));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      console.log('No user found with the given email.');
      return;
    }

    querySnapshot.forEach((docSnapshot) => {
      const userData = docSnapshot.data() as User;
      if (userData.referral) {
        setReferral(referralData + userData.referral);
        setHasReferral(true);
      }
    });
  }, []);

  const fetchReferralUsers = useCallback(async () => {
    const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
    const { email } = olympdPrefix;

    if (!email) {
      console.log('No email found in localStorage.');
      return;
    }

    try {
      const q = query(collection(firestore, 'OlympiadUsers'), where('email', '==', email));
      const snapshot = await getDocs(q);
      const users = snapshot.docs.map(doc => doc.data() as User);
      setReferralUsers(users);
    } catch (error) {
      console.error('Error fetching referrer users:', error);
    }
  }, []);

  const updateReferral = async () => {
    setIsLoading(true);
    const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
    const { email } = olympdPrefix;

    if (!email) {
      console.log('No logged in email found in localStorage.');
      setIsLoading(false);
      return;
    }

    const userQuery = query(collection(firestore, 'OlympiadUsers'), where('email', '==', email));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      console.log('No user found with the given email.');
      setIsLoading(false);
      return;
    }

    querySnapshot.forEach(async (docSnapshot) => {
      const userDocRef = doc(firestore, 'OlympiadUsers', docSnapshot.id);
      const referralUrl = generateReferralCode();
      await updateDoc(userDocRef, { referral: referralUrl });
      setReferral(domain + referralData + referralUrl);
      setHasReferral(true);
      setIsModal(true);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchUser(); // Fetch user and referral code on mount
    fetchReferralUsers(); // Fetch referral users on mount
  }, [fetchUser, fetchReferralUsers]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referral);
      alert('Referral data copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleCloseModal = () => setIsModal(false);

  return (
    <div className='content'>
      {isLoading && <Loader title='Loading...' />}
      {isModal &&
        <Modal
          modalTitle="Copy Referral"
          title="Copy to clipboard"
          data={referral}
          onClose={handleCloseModal}
        >
          <Button title="Copy Referral Data" type="button" isIcon iconPath={CopyClipboard} onClick={handleCopyToClipboard} />
        </Modal>
      }

      <h2>Refer & Earn Science 24</h2>
      <div className='how-it-works'>
        <h3>How It Works?</h3>

        <div className='works-card'>
          <div className='works-card-title'>
            <img src={invite} title="Invite Teachers" alt="Invite Teachers" className='icon' />
            <div className='works-card-description'>
              <h1>Invite Teachers</h1>
              <p>Invite Teachers in your network to International Teachers’ Olympiad</p>
              <div className='cta'>
                {!hasReferral ? (
                  <Button title='Generate Referral Code' type='button' onClick={updateReferral} />
                ) : (
                  <Button title='Invite Others' type='button' isIcon iconPath={WhatsappIcon} onClick={() => setIsModal(true)} />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='works-card'>
          <div className='works-card-title'>
            <img src={withdraw} title="Withdraw The cash" alt="Withdraw The cash" className='icon' />
            <div className='works-card-description'>
              <h1> Withdraw The cash</h1>
              <p>Withdraw the earned cash at the end of the olympiad through bank transfer or Gpay</p>
            </div>
          </div>
        </div>
      </div>
      <div className='earning-box'>
        <Card title='Total Earnings' amount='500' currency='₹' />
        <p>Note: Your earning will be deposited in your account post olympiad.</p>
      </div>
      <div className='table-wrapper'>
        <h3>Referral History</h3>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date Initiated</th>
              <th>Registration Status</th>
            </tr>
          </thead>
          <tbody>
            {referralUsers.flatMap((user, index) =>
              (user.referrerUsers || []).map((jsonString, refIndex) => {
                const referrer = JSON.parse(jsonString);
                return (
                  <tr key={`${index}-${refIndex}`}>
                    <td>{referrer.name}</td>
                    <td>{new Date(referrer.timestamp).toLocaleDateString()}</td>
                    <td>
                      {referrer.name ? (
                        <> <img src={tick} className='icon' alt='Registered' />  Registered </>
                      ) : (
                        <span> Not Registered</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferEarn;

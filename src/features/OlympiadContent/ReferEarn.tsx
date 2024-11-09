import { useState, useEffect, useCallback } from 'react';
import { firestore } from '../../utils/firebase';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Buttons/Button';
import Card from '../../components/Card/Card';
import ReferralHistory from './ReferralHistory';
import WhatsappIcon from '../../assets/whatsapp.svg';
import CopyClipboard from '../../assets/share.svg';
import invite from '../../assets/invite.svg';
import withdraw from '../../assets/withdraw.svg';
import Modal from '../../components/Modal/Modal';
import ReferralEarnings from './ReferralEarnings';

type Referrer = {
  timestamp: string;
  phone: string;
  name: string;
  email: string;
  olympiadName?: string; // Add olympiadName as an optional property
};

type User = {
  email: string;
  referral?: string;
  referrerUsers?: (Referrer | string)[]; // Allow an array of either Referrer or string
};

const getBaseUrl = (olympiadName: string): string => {
  switch (olympiadName) {
    case 'p24':
      return "https://www.upeducators.com/international-primary-teachers-olympiad/";
    case 'm24':
      return "https://www.upeducators.com/international-math-teachers-olympiad/";
    default:
      return "https://eduolympiad.upeducators.com/#/PaymentGateway";
  }
};

const ReferEarn = () => {
  const [referral, setReferral] = useState<string>('');
  const [hasReferral, setHasReferral] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [referralUrl, setReferralUrl] = useState<string>(''); // New state for referral URL

  const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
  const { email, olympiadName } = olympdPrefix;

  let olympiadLabelName = olympiadName === 's24' ? 'Science 2024' :
    olympiadName === 'm24' ? 'Maths 2024' :
      olympiadName === 'p24' ? 'Primary 2024' :
        olympiadName === 's24_2' ? 'Science 2024 - 2' :
          olympiadName === 'm24_2' ? 'Maths 2024 - 2' :
            olympiadName === 'p24_2' ? 'Primary 2024 - 2' :
              olympiadName;

  const referralData = `Hey! I am participating in the International ${olympiadLabelName} Teachers' Olympiad.\n
It's a fantastic opportunity for us teachers to get feedback on our teaching skills and get recognition for it!!\n
I found all the details in this video here: https://www.youtube.com/shorts/PQbG53FFA6s.\n
If you like it too, you can use my referral link for a 10% discount.\n\n`;

  const generateReferralCode = (): string => Math.random().toString(36).substring(2, 12);

  const fetchUser = useCallback(async () => {
    if (!email) {
      console.log('No logged-in email found in localStorage.');
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

      if (userData.referrerUsers) {
        userData.referrerUsers.forEach((referrer) => {
          if (typeof referrer === 'object' && referrer !== null) {
            console.log('Registered Olympiad:', referrer.olympiadName);
          } else if (typeof referrer === 'string') {
            console.log('Referrer is a string:', referrer);
          } else {
            console.log('Unexpected referrer type:', referrer);
          }
        });
      }

      if (userData.referral) {
        const baseUrl = getBaseUrl(olympiadName);
        const referralParams = `?olympiad=${olympiadName}&source=referral&referral=${userData.referral}`;
        setReferralUrl(`${baseUrl}${referralParams}`); // Construct the full URL with parameters
        setReferral(`${referralData}`); // Only set the referral data here
        setHasReferral(true);
      }
    });
  }, [email, olympiadName]);

  const updateReferral = async () => {
    setIsLoading(true);
    const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
    const { email } = olympdPrefix;

    if (!email) {
      console.log('No logged-in email found in localStorage.');
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
      const referralCode = generateReferralCode();
      await updateDoc(userDocRef, { referral: referralCode });
      const baseUrl = getBaseUrl(olympiadName);
      const referralParams = `?olympiad=${olympiadName}&source=internal&referral=${referralCode}`;
      setReferral(`${referralData}`);
      setReferralUrl(`${baseUrl}${referralParams}`); // Update the URL with new code
      setHasReferral(true);
      setIsModal(true);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${referral}${referralUrl}`); // Use the state variable for the URL
      alert('Messege copied, now you can share with others!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleCloseModal = () => setIsModal(false);

  return (
    <div className='content'>
      {isLoading && <Loader title='Loading...' />}
      {isModal && (
        <Modal
          modalTitle="Referral"
          title="Copy to clipboard"
          data={`${referral} <br /> <strong>Registration Link:</strong> ${referralUrl}`}
          onClose={handleCloseModal}
        >
          <Button title="Copy Referral Message" type="button" isIcon iconPath={CopyClipboard} onClick={handleCopyToClipboard} />
        </Modal>
      )}

      <h2>Refer & Earn</h2>
      <div className='earning-box'>
        <Card title='Total Earnings' amount={<ReferralEarnings />} currency='₹' />
        <p>Note: Your earning will be deposited in your account post-olympiad.</p>
      </div>
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
                  <Button title='Copy Referral Message' type='button' isIcon iconPath={WhatsappIcon} onClick={() => setIsModal(true)} />
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
      <ReferralHistory />
    </div>
  );
};

export default ReferEarn;

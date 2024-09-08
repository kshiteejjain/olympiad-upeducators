import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';

const ReferralEarnings = () => {
  const [referralAmount, setReferralAmount] = useState<number | null>(0);
  const [error, setError] = useState<string | null>(null);

  // Replace with the actual logic to get the logged-in user's email
  const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
  const userEmail = olympdPrefix?.email

  useEffect(() => {
    const fetchReferralAmount = async () => {
      try {
        if (!userEmail) {
          setError('User not logged in');
          return;
        }

        const docRef = doc(firestore, 'OlympiadUsers', userEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setReferralAmount(userData.referralAmount || 0);
        } else {
          setError('User data not found');
        }
      } catch (err) {
        setError('Failed to fetch referral amount');
        console.error(err);
      } finally {
      }
    };

    fetchReferralAmount();
  }, [userEmail]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {referralAmount?.toFixed(2) || '0.00'}
    </>
  );
};

export default ReferralEarnings;

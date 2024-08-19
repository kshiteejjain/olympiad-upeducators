import { firestore } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

type UserData = {
  olympiad?: string[];
  email?: string;
};

export const fetchUserOlympiadData = async (email: string): Promise<UserData[]> => {
  if (!email) {
    console.warn('No email provided for fetching user data');
    return [];
  }

  try {
    const userQuery = query(
      collection(firestore, 'OlympiadUsers'),
      where('email', '==', email)
    );
    const querySnapshot = await getDocs(userQuery);
    return querySnapshot.empty ? [] : querySnapshot.docs.map(doc => doc.data() as UserData);
  } catch (err) {
    console.error('Error fetching user Olympiad data:', err);
    throw new Error('Error fetching user Olympiad data');
  }
};

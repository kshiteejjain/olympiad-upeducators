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

    if (querySnapshot.empty) {
      console.log('No matching documents found');
      return [];
    } else {
      const userDataArray = querySnapshot.docs.map(doc => doc.data() as UserData);
      return userDataArray;
    }
  } catch (err) {
    console.error('Error fetching user Olympiad data:', err);
    throw new Error('Error fetching user Olympiad data');
  }
};


export const fetchUserRegistrationDate = async (userEmail: string) => {
  const userQuery = query(collection(firestore, 'OlympiadUsers'), where('email', '==', userEmail));
  const userSnapshot = await getDocs(userQuery);
  
  if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0].data();
      const userTimeStamp = userDoc.timeStamp;

      // Handle both Firestore Timestamp and Date
      if (userTimeStamp && typeof userTimeStamp.toDate === 'function') {
          return userTimeStamp.toDate();
      } else if (userTimeStamp instanceof Date) {
          return userTimeStamp; // Already a Date
      } else {
          // Handle cases where timestamp is a string or other format
          return new Date(userTimeStamp);
      }
  } else {
      console.warn('No user found with this email.');
      return null;
  }
};

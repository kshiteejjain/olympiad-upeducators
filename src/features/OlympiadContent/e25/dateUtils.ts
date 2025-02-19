import { firestore } from '../../../utils/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';

const olympiadDates = ['2025-02-01T17:00:00', '2024-03-08T17:00:00'];

export const fetchExamDateForUser = async (email: string) => {
    try {
        const snapshot = await getDocs(query(collection(firestore, 'OlympiadUsers'), where('email', '==', email)));
        const userDoc = snapshot.docs[0]?.data();
        const registerDate = userDoc?.e25Register?.toDate();

        if (registerDate) {
            const startDate = new Date(olympiadDates[0]);
            return registerDate < startDate ? startDate : new Date(olympiadDates[1]);
        }

        alert('Error: Invalid or missing registration date.');
        return null;
    } catch {
        alert('Error fetching user data.');
        return null;
    }
};

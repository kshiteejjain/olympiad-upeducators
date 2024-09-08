import { useCallback, useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import tick from '../../assets/tick.svg';

type ReferrerData = {
    name: string;
    email: string;
    timestamp: string; // Assuming this is a string. Adjust if it's a Date or other type.
};

type Props = {
    email: string;
    referral?: string;
    referrerUsers?: ReferrerData[] | string[];
    referrerData?: ReferrerData | string;
};

const ReferralHistory: React.FC = () => {
    const [referralUsers, setReferralUsers] = useState<Props[]>([]);

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
            const users = snapshot.docs.map(doc => doc.data() as Props);
            setReferralUsers(users);
        } catch (error) {
            console.error('Error fetching referrer users:', error);
        }
    }, []);

    useEffect(() => {
        fetchReferralUsers();
    }, [fetchReferralUsers]);

    return (
        <div className='table-wrapper'>
            <h3>Referral History</h3>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Date Initiated</th>
                        <th>Registration Status</th>
                    </tr>
                </thead>
                <tbody>
                    {referralUsers.flatMap((user, index) =>
                        (user.referrerUsers || []).map((referrerData, refIndex) => {
                            const referrer: ReferrerData = typeof referrerData === 'string'
                                ? JSON.parse(referrerData)
                                : referrerData;

                            return (
                                <tr key={`${index}-${refIndex}`}>
                                    <td>{referrer.name}</td>
                                    <td>{referrer.email}</td>
                                    <td>{new Date(referrer.timestamp).toLocaleDateString()}</td>
                                    <td>
                                        {referrer.name ? (
                                            <> <img src={tick} className='icon' alt='Registered' /> Registered </>
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
    );
};

export default ReferralHistory;

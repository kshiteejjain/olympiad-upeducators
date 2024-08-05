import { useEffect, useState } from 'react';
import { firestore } from '../../utils/firebase';
import { collection, getDocs, query, DocumentData } from 'firebase/firestore';
import Loader from '../../components/Loader/Loader';

const Admin = () => {
    const [data, setData] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const userQuery = query(collection(firestore, 'OlympiadUsers'));
                const querySnapshot = await getDocs(userQuery);

                if (!querySnapshot.empty) {
                    const usersData = querySnapshot.docs.map(doc => doc.data());
                    setData(usersData);
                } else {
                    console.log('No user found.');
                    setData([]); // Optionally set an empty array if no data
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) return <Loader />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="content">
            <h2>Admin</h2>
            {data.length === 0 ? (
                <p>No users available.</p>
            ) : (
                <div className='table-wrapper'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Payment Id</th>
                                <th>LMS Details</th>
                                <th>Registered Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone || user.profile?.mobileNumber} <br /> wa: {user.profile.whatsappNumber}</td>
                                    <td>{user.paymentDetails?.razorpay_payment_id}</td>
                                    <td>
                                        {user.profile ? (
                                            <>
                                                <strong>Board:</strong> {user.profile.board}<br />
                                                <strong>City:</strong> {user.profile.city}<br />
                                                <strong>Country:</strong> {user.profile.country}<br />
                                                <strong>Date of Birth:</strong> {user.profile.dateOfBirth}<br />
                                                <strong>Grade Level:</strong> {user.profile.gradeLevel}<br />
                                                <strong>Organization Name:</strong> {user.profile.organizationName}<br />
                                                <strong>Organization Type:</strong> {user.profile.organizationType}<br />
                                                <strong>Role:</strong> {user.profile.role}<br />
                                            </>
                                        ) : 'N/A'}
                                    </td>
                                    <td>{user.timeStamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Admin;

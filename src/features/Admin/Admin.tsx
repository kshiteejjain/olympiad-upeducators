import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../utils/firebase';
import { collection, getDocs, query, DocumentData } from 'firebase/firestore';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

import './Admin.css';

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const Admin = () => {
    const [data, setData] = useState<DocumentData[]>([]);
    const [filteredData, setFilteredData] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const userQuery = query(collection(firestore, 'OlympiadUsers'));
                const querySnapshot = await getDocs(userQuery);

                if (!querySnapshot.empty) {
                    const usersData = querySnapshot.docs.map(doc => doc.data());
                    setData(usersData);
                    setFilteredData(usersData); // Initialize filtered data
                } else {
                    console.log('No user found.');
                    setData([]);
                    setFilteredData([]);
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

    useEffect(() => {
        const filterDataByDate = () => {
            if (startDate && endDate) {
                const filtered = data.filter(user => {
                    // Check if user.timeStamp is valid
                    const userDateString = user.timeStamp;
                    if (!userDateString) return false;
        
                    const userDate = new Date(userDateString);
                    // Check if the date is invalid
                    if (isNaN(userDate.getTime())) return false;
        
                    // Convert userDate to ISO string without time part
                    const userDateISO = userDate.toISOString().split('T')[0];
                    return userDateISO >= startDate && userDateISO <= endDate;
                });
                setFilteredData(filtered);
            } else {
                setFilteredData(data); // Reset to full data if no dates are selected
            }
        };        

        filterDataByDate();
    }, [startDate, endDate, data]);

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setFilteredData(data); // Reset to full data
    };

    if (loading) return <Loader />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="content">
            <div className='admin-cta-row'>
                <h2>Admin </h2>
                <span className='admin-cta'><Button type='button' title='Add User' isSecondary onClick={()=> navigate('/AddUser')} /> </span>
                </div>
            <div className="date-filter">
                <form>
                    <div className='from-group'>
                        <label>From:</label>
                            <input
                                type="date"
                                className='form-control'
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                    </div>
                    <div className='from-group'>
                        <label>To:</label>
                            <input
                                type="date"
                                value={endDate}
                                className='form-control'
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                    </div>
                    <Button type='button' title='Reset' isSecondary onClick={handleReset} />
                </form>
            </div>

            {filteredData.length === 0 ? (
                <ErrorBoundary message='No Data available, Try changing dates.' />
            ) : (
                <div className='table-wrapper'>
                    <table className='table admin-table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>WhatsApp</th>
                                <th>Payment Id</th>
                                <th>Registered Date</th>
                                <th>LMS Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone || user.profile?.mobileNumber}</td>
                                    <td>{user?.profile?.whatsappNumber}</td>
                                    <td>{user.paymentDetails?.razorpay_payment_id}</td>
                                    <td>{formatDate(user.timeStamp)}</td>
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

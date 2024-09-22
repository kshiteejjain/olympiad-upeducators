import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../utils/firebase';
import { collection, getDocs, query, doc, deleteDoc, DocumentData } from 'firebase/firestore';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import { saveAs } from 'file-saver';

import ExamResults from './ExamResults';

import './Admin.css';

// Utility function to format date
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Simplified date formatting
};

// Utility function to convert JSON data to CSV
const jsonToCSV = (data: DocumentData[]) => {
    const headers = [
        'Name', 'Email', 'WhatsApp', 'Olympiad', 'Payment Id', 'Registered Date',
        'Board', 'City', 'Country', 'Date of Birth', 'Grade Level',
        'Organization Name', 'Organization Type', 'Role'
    ];

    const csvRows = [];
    // Add the headers
    csvRows.push(headers.join(','));

    // Add the data rows
    data.forEach(user => {
        const row = [
            user.name,
            user.email,
            user.phone,
            (user.olympiad || []).join(', '),
            user.paymentDetails?.razorpay_payment_id,
            formatDate(user.timeStamp),
            user.profile?.board,
            user.profile?.city,
            user.profile?.country,
            user.profile?.dateOfBirth,
            user.profile?.gradeLevel,
            user.profile?.organizationName,
            user.profile?.organizationType,
            user.profile?.role
        ];
        csvRows.push(row.map(value => `"${value}"`).join(','));
    });

    return csvRows.join('\n');
};

const Admin = () => {
    const [data, setData] = useState<DocumentData[]>([]);
    const [filteredData, setFilteredData] = useState<DocumentData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedOlympiad, setSelectedOlympiad] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(query(collection(firestore, 'OlympiadUsers')));
                const usersData = querySnapshot.empty ? [] : querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(usersData);
                setFilteredData(usersData);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const filterData = () => {
            const filteredByDate = startDate && endDate
                ? data.filter(user => {
                    const userDate = new Date(user.timeStamp || '');
                    return !isNaN(userDate.getTime()) && userDate.toISOString().split('T')[0] >= startDate && userDate.toISOString().split('T')[0] <= endDate;
                })
                : data;

            const filteredByOlympiad = selectedOlympiad
                ? filteredByDate.filter(user => (user.olympiad || []).includes(selectedOlympiad))
                : filteredByDate;

            const filteredBySearch = searchQuery
                ? filteredByOlympiad.filter(user => {
                    const searchLower = searchQuery.toLowerCase();
                    return Object.values(user).some(value =>
                        typeof value === 'string' && value.toLowerCase().includes(searchLower)
                    );
                })
                : filteredByOlympiad;

            setFilteredData(filteredBySearch);
        };

        filterData();
    }, [startDate, endDate, searchQuery, selectedOlympiad, data]);

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setSearchQuery('');
        setSelectedOlympiad('');
        setFilteredData(data);
    };

    const exportToCSV = () => {
        const csvData = jsonToCSV(filteredData);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'Olympiad_Users.csv');
    };

    const handleDelete = async (userId: string) => {
        if (window.confirm(`Are you sure to delete ${userId}?`)) {
            try {
                await deleteDoc(doc(firestore, 'OlympiadUsers', userId));
                setData(prevData => prevData.filter(user => user.id !== userId));
                setFilteredData(prevFiltered => prevFiltered.filter(user => user.id !== userId));
            } catch (err) {
                console.error('Error deleting user:', err);
                setError('Error deleting user');
            }
        }
    };

    if (loading) return <Loader />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="content">
            <div className='admin-cta-row'>
                <h2>Admin</h2>
                <div className='admin-cta-right'>
                    <Button type='button' title='Add User' onClick={() => navigate('/AddUser')} />
                </div>
            </div>
            <div className="date-filter">
                <form>
                    <div className='form-group'>
                        <label>Search:</label>
                        <input
                            type="text"
                            className='form-control'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, email, etc."
                        />
                    </div>
                    <div className='form-group'>
                        <label>From:</label>
                        <input
                            type="date"
                            className='form-control'
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label>To:</label>
                        <input
                            type="date"
                            value={endDate}
                            className='form-control'
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Olympiad:</label>
                        <select
                            className='form-control'
                            value={selectedOlympiad}
                            onChange={(e) => setSelectedOlympiad(e.target.value)}
                        >
                            <option value="">All</option>
                            {Array.from(new Set(filteredData.flatMap(user => user.olympiad || []))).map((olympiad, index) => (
                                <option key={index} value={olympiad}>{olympiad}</option>
                            ))}
                        </select>
                    </div>
                    <Button type='button' title='Reset' isSecondary onClick={handleReset} />
                </form>
            </div>
            {filteredData.length === 0 ? (
                <ErrorBoundary message='No Data available.' />
            ) : (
                <>
                    <h2 className='flex'>Olympiad Registered Users ({filteredData.length}) <Button type='button' title='Export Users' onClick={exportToCSV} /></h2>
                    <div className='table-wrapper'>
                        <table className='table admin-table'>
                            <thead>
                                <tr>
                                    {[
                                        'Name', 'Email', 'WhatsApp', 'Olympiad', 'Payment Id', 'Registered Date',
                                        'Board', 'City', 'Country', 'Date of Birth', 'Grade Level',
                                        'Organization Name', 'Organization Type', 'Role', 'Action'
                                    ].map((header, index) => (
                                        <th key={index}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user?.name}</td>
                                        <td>{user?.email}</td>
                                        <td>{user?.phone}</td>
                                        <td>{(user?.olympiad || []).join(', ')}</td>
                                        <td>{user.paymentDetails?.razorpay_payment_id}</td>
                                        <td>{formatDate(user.timeStamp)}</td>
                                        <td>{user?.profile?.board}</td>
                                        <td>{user?.profile?.city}</td>
                                        <td>{user?.profile?.country}</td>
                                        <td>{user?.profile?.dateOfBirth}</td>
                                        <td>{user?.profile?.gradeLevel}</td>
                                        <td>{user?.profile?.organizationName}</td>
                                        <td>{user?.profile?.organizationType}</td>
                                        <td>{user?.profile?.role}</td>
                                        <td>
                                            <Button 
                                                type='button' 
                                                isError
                                                title='Delete' 
                                                onClick={() => handleDelete(user.id)} 
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            <ExamResults />
        </div>
    );
};

export default Admin;

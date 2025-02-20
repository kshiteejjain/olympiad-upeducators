import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../utils/firebase';
import { collection, getDocs, query, doc, deleteDoc, updateDoc, DocumentData, limit, startAfter, getCountFromServer, orderBy, QueryDocumentSnapshot } from 'firebase/firestore';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import { saveAs } from 'file-saver';
import ExamResults from './ExamResults';
import Pagination from '../../components/Pagination/Pagination';

import './Admin.css';

// Utility function to format date
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Simplified date formatting
};

// Utility function to convert JSON data to CSV
const jsonToCSV = (data: DocumentData[]) => {
    const headers = [
        'Name', 'Email', 'WhatsApp', 'Olympiad', 'Payment Id', 'Source', 'Registered Date',
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
            user.source,
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
    const [editingOlympiad, setEditingOlympiad] = useState<{ [key: string]: string }>({});
    const [selectedDateRange, setSelectedDateRange] = useState('');
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const recordsPerPage = 100;
    const [buttonState, setButtonState] = useState({
        text: 'Export Users',
        counter: 1
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchTotalCount();
        fetchData();
    }, [currentPage]);

    const fetchTotalCount = async () => {
        try {
            const q = query(collection(firestore, 'OlympiadUsers'));
            const snapshot = await getCountFromServer(q);
            setTotalRecords(snapshot.data().count);
        } catch (err) {
            console.log('Error getting total count:', err);
        }
    };

    // Pagination function: update the page number
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Ensure that the fetchData fetches the correct slice of data for the current page
    const fetchData = async () => {
        try {
            setLoading(true);

            // Construct the query
            let q;

            if (lastVisible) {
                // If lastVisible exists, paginate with startAfter
                q = query(
                    collection(firestore, 'OlympiadUsers'),
                    orderBy('timeStamp', 'desc'),  // Order by 'timeStamp' descending
                    limit(recordsPerPage),
                    startAfter(lastVisible) // Fetch from the last visible document
                );
            } else {
                // For the first load, do not use startAfter, just get the first set of data
                q = query(
                    collection(firestore, 'OlympiadUsers'),
                    orderBy('timeStamp', 'desc'),  // Order by 'timeStamp' descending
                    limit(recordsPerPage)
                );
            }

            const querySnapshot = await getDocs(q);
            const usersData = querySnapshot.empty ? [] : querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Check if there is data
            if (usersData.length > 0) {
                setData(usersData);
                setFilteredData(usersData);
                // Update the lastVisible for pagination
                const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
                setLastVisible(lastVisibleDoc);
            } else {
                setFilteredData([]);
            }

        } catch (err) {
            console.log('Error fetching data:', err);
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    };


    // Utility function to convert a UTC date string to IST (Indian Standard Time)
    const convertToIST = (dateString: string): string => {
        const date = new Date(dateString);
        const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        istDate.setHours(0, 0, 0, 0); // Set time to 00:00 (midnight) IST
        return istDate.toISOString().split('T')[0]; // return as "YYYY-MM-DD"
    };

    // Get today's date in IST with time set to midnight (00:00)
    const getToday = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to 00:00 (midnight)
        return convertToIST(today.toISOString()); // Return as IST "YYYY-MM-DD"
    };

    // Get yesterday's date in IST with time set to midnight (00:00)
    const getYesterday = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0); // Set time to 00:00 (midnight)
        return convertToIST(yesterday.toISOString()); // Return as IST "YYYY-MM-DD"
    };

    // Get the date for 7 days ago in IST with time set to midnight (00:00)
    const getLast7Days = () => {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        last7Days.setHours(0, 0, 0, 0); // Set time to 00:00 (midnight)
        return convertToIST(last7Days.toISOString()); // Return as IST "YYYY-MM-DD"
    };

    useEffect(() => {
        const filterData = () => {
            let filteredByDate = data;

            // Date range filters: Today, Yesterday, Last 7 days, or All
            if (startDate && endDate) {
                filteredByDate = data.filter(user => {
                    const userDateInIST = convertToIST(user.timeStamp || ''); // Convert to IST
                    return userDateInIST >= startDate && userDateInIST <= endDate;
                });
            } else if (selectedDateRange) {
                const today = getToday(); // Today's date in IST (midnight)
                const yesterday = getYesterday(); // Yesterday's date in IST (midnight)
                const last7Days = getLast7Days(); // Last 7 days date in IST (midnight)

                switch (selectedDateRange) {
                    case 'today':
                        filteredByDate = data.filter(user => {
                            const userDateInIST = convertToIST(user.timeStamp || '');
                            return userDateInIST === today; // Only today's date in IST
                        });
                        break;
                    case 'yesterday':
                        filteredByDate = data.filter(user => {
                            const userDateInIST = convertToIST(user.timeStamp || '');
                            return userDateInIST === yesterday; // Only yesterday's date in IST
                        });
                        break;
                    case 'last7days':
                        filteredByDate = data.filter(user => {
                            const userDateInIST = convertToIST(user.timeStamp || '');
                            return userDateInIST >= last7Days && userDateInIST <= today; // Filter last 7 days
                        });
                        break;
                    case 'all': // Handle "All" option to show all data
                        filteredByDate = data;
                        break;
                    default:
                        break;
                }
            }

            // Filter by Olympiad
            const filteredByOlympiad = selectedOlympiad
                ? filteredByDate.filter(user => (user.olympiad || []).includes(selectedOlympiad))
                : filteredByDate;

            // Filter by search query
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
    }, [startDate, endDate, searchQuery, selectedOlympiad, selectedDateRange, data]);

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setSearchQuery('');
        setSelectedOlympiad('');
        setFilteredData(data);
    };

    // const exportToCSV = () => {
    //     const csvData = jsonToCSV(filteredData);
    //     const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    //     saveAs(blob, 'Olympiad_Users.csv');
    // };

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

    const handleOlympiadChange = (userId: string, newOlympiad: string) => {
        setEditingOlympiad(prev => ({
            ...prev,
            [userId]: newOlympiad
        }));
    };

    const handleImageClick = (imageUrl: string) => {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(`<img src="${imageUrl}" alt="Profile Image" style="width:100%; height:auto;" />`);
        } else {
            console.error('Failed to open new window');
        }
    };

    const saveOlympiad = async (userId: string, olympiad: string) => {
        try {
            const userRef = doc(firestore, 'OlympiadUsers', userId);
            await updateDoc(userRef, {
                olympiad: olympiad.split(',').map(item => item.trim()) // assuming comma-separated values for Olympiad
            });
            setEditingOlympiad(prev => {
                const { [userId]: _, ...rest } = prev;
                return rest;
            });
            // Update the local state with the new Olympiad
            setData(prevData => prevData.map(user => user.id === userId ? { ...user, olympiad: olympiad.split(',').map(item => item.trim()) } : user));
            setFilteredData(prevFiltered => prevFiltered.map(user => user.id === userId ? { ...user, olympiad: olympiad.split(',').map(item => item.trim()) } : user));
        } catch (err) {
            console.error('Error saving Olympiad:', err);
            setError('Error saving Olympiad');
        }
    };

    if (loading) return <Loader />;
    if (error) return <div>Error: {error}</div>;


    const exportToCSVInBatches = async () => {
        setButtonState({ text: 'Processing... 1', counter: 1 });  // Start with "Processing... 1"
        const batchSize = 1000;  // Define a batch size
        let allData: DocumentData[] = [];
        let lastVisible = null;
        let fetching = true;

        while (fetching) {
            let q = query(
                collection(firestore, 'OlympiadUsers'),
                orderBy('timeStamp'),
                limit(batchSize)
            );

            if (lastVisible) {
                q = query(q, startAfter(lastVisible));
            }

            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                fetching = false;
                break;
            }

            snapshot.docs.forEach(doc => {
                allData.push(doc.data());
            });

            lastVisible = snapshot.docs[snapshot.docs.length - 1];

            // Increment the processing counter after each batch is fetched
            setButtonState(prevState => {
                const newCounter = prevState.counter + 1;
                return {
                    text: `Processing... ${newCounter}`,  // Update the button title with the new counter
                    counter: newCounter
                };
            });
        }

        // Once all data is fetched, convert to CSV and download
        const csvData = jsonToCSV(allData);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'Olympiad_Users.csv');

        setButtonState({ text: 'Export Users', counter: 1 });  // Reset the button text and counter after the download is triggered
    };


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
                        <label>Date Range:</label>
                        <select
                            className='form-control'
                            value={selectedDateRange}
                            onChange={(e) => setSelectedDateRange(e.target.value)}
                        >
                            <option value="">Select Date Range</option>
                            <option value="all">All</option>
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="last7days">Last 7 Days</option>
                        </select>
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
                    <h2 className='flex justify-between'>Olympiad Registered Users ({totalRecords})
                        <span>
                            <Button type='button' title={buttonState.text} onClick={exportToCSVInBatches} />
                        </span>
                    </h2>
                    <div className='table-wrapper'>
                        <table className='table admin-table'>
                            <thead>
                                <tr>
                                    {[
                                        'Sr.', 'Name', 'Email', 'from Webhook', 'Profile Picture', 'WhatsApp', 'Olympiad', 'Payment Id', 'Source', 'Registered Date',
                                        'e25 Register', 'p25 Register', 's25 Register', 'Board', 'City', 'Country', 'Date of Birth', 'Grade Level',
                                        'Organization Name', 'Organization Type', 'Role', 'Action'
                                    ].map((header, index) => (
                                        <th key={index}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((user, index) => (
                                    <tr key={index} className={user.olympiad && user.olympiad.includes('p24') ? 'red-olympiad' : ''}>
                                        <td>{index + 1 + (recordsPerPage * (currentPage - 1))}</td>
                                        <td>{user?.name}</td>
                                        <td>{user?.email}</td>
                                        <td>{user?.fromWebhook ? <span className='red'>Yes</span> : 'No'}</td>
                                        <td>
                                            {user?.profile?.image ? (
                                                <a href="javascript:void(0)" onClick={() => handleImageClick(user?.profile?.image)}>Click Here</a>
                                            ) : 'NA'}
                                        </td>
                                        <td>{user?.phone}</td>
                                        <td>
                                            {editingOlympiad[user.id] ? (
                                                <input
                                                    type="text"
                                                    value={editingOlympiad[user.id]}
                                                    autoFocus
                                                    onChange={(e) => handleOlympiadChange(user.id, e.target.value)}
                                                />
                                            ) : (
                                                (user?.olympiad || []).join(', ')
                                            )}
                                        </td>
                                        <td>{user.paymentId || 'NA'}</td>
                                        <td>{user.source || 'NA'}</td>
                                        <td>{formatDate(user.timeStamp)}</td>
                                        <td>{new Date(user.e25Register).toLocaleDateString('en-GB').replace(/\//g, '-') || "NA"} </td>
                                        <td>{new Date(user.p25Register).toLocaleDateString('en-GB').replace(/\//g, '-') || "NA"}</td>
                                        <td>{new Date(user.s25Register).toLocaleDateString('en-GB').replace(/\//g, '-') || "NA"}</td>
                                        <td>{user?.profile?.board}</td>
                                        <td>{user?.profile?.city}</td>
                                        <td>{user?.profile?.country}</td>
                                        <td>{user?.profile?.dateOfBirth}</td>
                                        <td>{user?.profile?.gradeLevel}</td>
                                        <td>{user?.profile?.organizationName}</td>
                                        <td>{user?.profile?.organizationType}</td>
                                        <td>{user?.profile?.role}</td>
                                        <td>
                                            {editingOlympiad[user.id] ? (
                                                <Button
                                                    type="button"
                                                    title="Save"
                                                    onClick={() => saveOlympiad(user.id, editingOlympiad[user.id])}
                                                />
                                            ) : (
                                                <Button
                                                    type="button"
                                                    title="Edit"
                                                    isSecondary
                                                    onClick={() => setEditingOlympiad({ ...editingOlympiad, [user.id]: (user.olympiad || []).join(', ') })}
                                                />
                                            )}
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
                        <Pagination
                            currentPage={currentPage}
                            totalRecords={totalRecords}
                            recordsPerPage={recordsPerPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </>
            )}
            <ExamResults />
        </div>
    );
};

export default Admin;

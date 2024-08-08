import { useState, useEffect } from 'react';
import { firestore } from '../../utils/firebase';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Buttons/Button';
import Card from '../../components/Card/Card';
import WhatsappIcon from '../../assets/whatsapp.svg';
import CopyClipboard from '../../assets/share.svg';
import tick from '../../assets/tick.svg';
import Modal from '../../components/Modal/Modal';

import './ReferEarn.css';

const ReferEarn = () => {
    const [referral, setReferral] = useState('');
    const [hasReferral, setHasReferral] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const referralData = `Hey! I am participating in the International Maths Teachers' Olympiad.
    It's a fantastic opportunity for us teachers to get feedback on our teaching skills and get recognition for it!!
    I found all the details in this video here: upeducators.com.
    If you like it too, you can use my referral link for a 10% discount. `;
    const domain = window.location.origin;
    const generateReferralCode = () => {
        const code = Math.random().toString(36).substring(2, 12);
        return `referral=${code}`;
    };

    const fetchAndCheckReferral = async () => {
        //setIsLoading(true);
        const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
        const { email } = olympdPrefix;
        if (!email) {
            console.log('No logged in email found in localStorage.');
            return;
        }

        const userQuery = query(collection(firestore, 'OlympiadUsers'), where('email', '==', email));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((docSnapshot) => {
                const userData = docSnapshot.data();
                if (userData.referral) {
                    setReferral(referralData + userData.referral);
                    setHasReferral(true);
                    console.log('Existing referral code fetched successfully.');
                    setIsLoading(false)
                }
            });
        } else {
            console.log('No user found with the given email.');
        }
    };

    const updateReferral = async () => {
        //setIsLoading(true);
        const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
        const { email } = olympdPrefix;
        if (!email) {
            console.log('No logged in email found in localStorage.');
            return;
        }

        const userQuery = query(collection(firestore, 'OlympiadUsers'), where('email', '==', email));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
            querySnapshot.forEach(async (docSnapshot) => {
                const userDocRef = doc(firestore, 'OlympiadUsers', docSnapshot.id);
                const referralUrl = generateReferralCode();
                await updateDoc(userDocRef, { referral: referralUrl });
                setReferral(domain + referralData + referralUrl);
                setHasReferral(true);
                console.log('Referral code updated successfully.');
                setIsModal(true);
                setIsLoading(false);
            });
        } else {
            console.log('No user found with the given email.');
        }
    };

    useEffect(() => {
        fetchAndCheckReferral(); // Fetch and check referral code when component mounts
    }, []);

    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(referral);
            alert('Referral data copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handleCloseModal = () => {
        setIsModal(false);
    };

    return (
        <div className='content'>
            {isLoading && <Loader title='Loading...' />}
            {isModal &&
                <Modal
                    modalTitle="Copy Referral"
                    title="Copy to clipboard"
                    data={referral}
                    onClose={handleCloseModal}
                >
                    <Button title="Copy Referral Data" type="button" isIcon iconPath={CopyClipboard} onClick={handleCopyToClipboard} />
                </Modal>
            }

            <h2>Refer & Earn</h2>
            <div className='how-it-works'>
                <h3>How It Works?</h3>

                <div className='works-card'>
                    <div className='works-card-title'>
                        <span className='number'>1</span>
                        <div className='works-card-description'>
                            <h1>Invite Teachers</h1>
                            <p>Invite Teachers in your network to International Teachers’ Olympiad</p>
                            <div className='cta'>
                                {!hasReferral ? (
                                    <Button title='Generate Referral Code' type='button' onClick={updateReferral} />
                                ):
                                <Button title='Invite Others' type='button' isIcon iconPath={WhatsappIcon} onClick={() => setIsModal(true)} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='works-card'>
                    <div className='works-card-title'>
                        <span className='number'>2</span>
                        <div className='works-card-description'>
                            <h1> Withdraw The cash</h1>
                            <p>1. Claim the earned cash on the olympiad result date by filling the Earnings claim form (it will be sent on email)</p>
                            <p>2. You will need to add your bank details or UPI details in that form to claim the Earnings.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='earning-box'>
                <Card title='Total Earnings' amount='500' currency='₹' />
                <p>Note: Your earning will be deposited in your account post olympiad.</p>
            </div>
            <div className='table-wrapper'>
                <h3>Referral History</h3>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date Initiated</th>
                            <th>Regisreation Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Sushil Tiwari</td>
                            <td>29/07/2024 13:40</td>
                            <td> <img src={tick} className='icon' /> Registered</td>
                        </tr>
                        <tr>
                            <td>Kshiteej Jain</td>
                            <td>29/07/2024 13:40</td>
                            <td> <img src={tick} className='icon' /> Registered</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default ReferEarn;

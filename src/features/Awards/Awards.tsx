import Button from '../../components/Buttons/Button';
import Card from '../../components/Card/Card';
import WhatsappIcon from '../../assets/whatsapp.svg'
import ShareIcon from '../../assets/share.svg'

import './Awards.css';

const Awards = () => {
    return (
        <>
            <div className='container-wrapper'>
                <h2>Awards</h2>
                <div className='earning-box'>
                    <Card title='Total Earnings' amount='500' currency='₹' />
                    <Card title='Total Balance' amount='500' currency='₹' bgWhite isButton />
                </div>
                <h3>How It Works?</h3>
                <div className='how-it-works'>
                    <div className='works-card'>
                        <div className='works-card-title'>
                            <span className='number'>1</span>
                            <div className='works-card-description'>
                                <h1>Invite Teachers</h1>
                                <p>Invite Teachers in your network to International Teachers’ Olympiad</p>
                            </div>
                        </div>
                        <div className='cta'>
                            <Button title='Invite via Whatsapp' type='button' isIcon iconPath={WhatsappIcon} />
                            <Button title='Share' type='button' isIcon iconPath={ShareIcon} />
                        </div>
                    </div>
                    <div className='works-card'>
                        <div className='works-card-title'>
                            <span className='number'>2</span>
                            <div className='works-card-description'>
                                <h1> Withdraw The cash</h1>
                                <p>Withdraw the earned cash at the end of the olympiad through bank transfer or Gpay</p>
                            </div>
                        </div>
                    </div>
                </div>

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
                            <td>Registered</td>
                        </tr>
                        <tr>
                            <td>Kshiteej Jain</td>
                            <td>29/07/2024 13:40</td>
                            <td>Registered</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
};
export default Awards;
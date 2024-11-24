import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import Button from '../../components/Buttons/Button';
import { sendWhatsappMessageOTP } from "../SendWhatsappMessage/SendWhatsappMessage";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Loader from "../../components/Loader/Loader";
import whatsappSvg from "../../assets/whatsappSvg.svg";

const LoginWithPhone = () => {
  const [userDetails, setUserDetails] = useState({
    phone: ''
  });
  const [isError, setIsError] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const generateOTP = Math.floor(Math.random() * 1000000).toString();
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setIsLoader(true)

      const phone = userDetails.phone;

      // Check if the user exists
      const collectionRef = collection(firestore, 'OlympiadUsers');
      const q = query(collectionRef, where('phone', '==', phone));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Email does not exist
        setIsLoader(false)
        setIsError(true)
      } else {
        const userDoc = querySnapshot.docs[0]; // Assuming there's only one document
        const userData = userDoc.data();
        const userName = userData.name || 'No Name'; // Adjust according to your schema
        const email = userData.email || 'No Email'; // Adjust according to your schema
        const phone = userData.phone || 'No Phone'; // Adjust according to your schema
        const image = userData?.profile?.image; // Adjust according to your schema
        const olympiad = userData?.olympiad.map((item: any) => item.toLowerCase());
        const olympiadName = userData?.olympiad[userData.olympiad.length - 1];

        // Update localStorage with user details
        const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
        olympdPrefix.name = userName;
        olympdPrefix.email = email;
        olympdPrefix.phone = phone;
        olympdPrefix.image = image;
        olympdPrefix.olympiad = olympiad;
        olympdPrefix.olympiadName = olympiadName
        olympdPrefix.code = generateOTP;
        olympdPrefix.isPhoneOTP = true;
        localStorage.setItem('olympd_prefix', JSON.stringify(olympdPrefix));
        navigate('/EnterOTP');
        // Send email
        const var1 = generateOTP;      // Dynamic variable 1
        await sendWhatsappMessageOTP(phone, var1);
        setIsLoader(false)
      }
    } catch (error) {
      alert('Error querying data from Firestore: ' + error);
    }
  };


  useEffect(() => {
    const checkPaymentDetails = async () => {
      try {
        const olympdPrefix = localStorage.getItem('olympd_prefix');
        if (olympdPrefix) {
          const olympdData = JSON.parse(olympdPrefix);
          const identifier = olympdData.phone || olympdData.email; // Check by phone or email
          if (!identifier) return;

          const collectionRef = collection(firestore, 'OlympiadUsers');
          const q = query(collectionRef, where('phone', '==', identifier)); // Adjust query if checking email
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            console.log('User does not exist');
          } else {
            querySnapshot.forEach((doc) => {
              const paymentDetails = doc.data().paymentDetails;
              if (paymentDetails && paymentDetails.razorpay_payment_id) {
                console.log('Payment details found:', paymentDetails);
              } else {
                console.log('No payment details available');
              }
            });
          }
        }
      } catch (error) {
        console.error('Error querying data from Firestore:', error);
      }
    };

    checkPaymentDetails();
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '').slice(0, 10);
    setUserDetails({ phone: newValue });
    setIsError(false);
  };

  return (
    <>
      {isLoader && <Loader title={'Loading..'} />}
      <form onSubmit={handleSubmit}>
        <h1>Enter Phone</h1>
        <div className='form-group'>
          <label htmlFor='phone'>Phone<span className="asterisk">*</span></label>
          <input
            type='tel'
            className='form-control'
            required
            name="phone"
            autoFocus
            autoComplete="off"
            value={userDetails.phone}
            onChange={handlePhoneChange}
            pattern="[0-9]{10}"
            maxLength={10}
          />
          {isError && <ErrorBoundary message={'Please enter registered mobile number.'} />}
          <p className="input-note">Note: You will get notifications on <img src={whatsappSvg} /> </p>
        </div>
        <Button title='Send' type='submit' />
      </form>
    </>
  );
};

export default LoginWithPhone;

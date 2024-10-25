import { useState, useEffect } from "react";
import Button from "../../components/Buttons/Button";
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import { useNavigate } from "react-router-dom";
import { sendEmail } from "../SendEmail/SendEmail";
import { sendWhatsappMessage } from "../SendWhatsappMessage/SendWhatsappMessage";
import whatsappSvg from "../../assets/whatsappSvg.svg";
import logoWhite from "../../assets/logo-white.png";

import './PaymentGateway.css';

type RazorpayOptions = {
  key: string;
  amount: string;
  name: string;
  description: string;
  image: string;
  handler: (response: { razorpay_payment_id: string }) => void;
  prefill: {
    name: string;
    contact: string;
    email: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
    hide_topbar: boolean;
  };
};

type RazorpayWindow = Window & {
  Razorpay: new (options: RazorpayOptions) => {
    open: () => void;
  };
};

const PaymentGateway = () => {
  const [userDetails, setUserDetails] = useState({ name: '', email: '', phone: '' });
  const [isFormValid, setIsFormValid] = useState(false);
  const [urlParams, setUrlParams] = useState<{ referralCode: string | null; source: string | null; olympiad: string | null }>({ referralCode: null, source: null, olympiad: null });
  const totalPrice = 2;
  const [discountedPrice, setDiscountedPrice] = useState(totalPrice);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');

    const referralCode = params.get('referral');
    const source = params.get('source');
    const olympiad = params.get('olympiad')?.trim() || null;

    setUrlParams({ referralCode, source, olympiad });

    if (referralCode) {
      const discount = totalPrice * 0.10;
      setDiscountedPrice(totalPrice - discount);
    }
  }, [totalPrice]);

  useEffect(() => {
    setIsFormValid(userDetails.name !== '' && userDetails.email !== '' && userDetails.phone !== '');
  }, [userDetails]);

  // Fetch user data and Olympiad details to check against the URL parameters
  const checkOlympiadMatch = async () => {
    const urlOlympiad = urlParams.olympiad;

    // Check if urlOlympiad is null
    if (!urlOlympiad) {
      console.warn('Olympiad parameter is missing in the URL.');
      return false; // Allow registration if the Olympiad parameter is not provided
    }

    try {
      const emailLowerCase = userDetails.email.toLowerCase();
      const docRef = doc(firestore, 'OlympiadUsers', emailLowerCase);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log('Fetched user data from Firestore:', userData);

        const userOlympiads = userData.olympiad || [];

        // If they are already registered for the exact Olympiad, alert the user
        if (userOlympiads.includes(urlOlympiad)) {
          alert('You are already registered for this Olympiad.');
          console.log(`User with email ${emailLowerCase} has already registered for Olympiad: ${urlOlympiad}`);
          return true; // Indicates that the user can't register
        } else {
          console.log('User can proceed with registration.');
          return false; // Indicates that the user can register
        }
      } else {
        console.log('User not found in Firestore. Proceeding with registration.');
        return false; // Indicates that the user can register
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return false; // Default to allowing registration on error
    }
  };


  
  const handleSubmit = async () => {
    const canRegister = await checkOlympiadMatch(); // Check if user can register
    if (canRegister) return; // If user can't register, exit

    const { name, email, phone } = userDetails;
    const emailLowerCase = email.toLowerCase();
    const olympiadId = urlParams.olympiad;
    const source = urlParams.source;

    if (!olympiadId) {
        alert('Olympiad ID (Olympiad) is required. Please ensure the URL contains the correct parameter.');
        return;
    }

    try {
        const docRef = doc(firestore, 'OlympiadUsers', emailLowerCase);
        const docSnap = await getDoc(docRef);

        let docData = docSnap.exists() ? docSnap.data() : {};

        if (!docData.olympiad) docData.olympiad = [];
        if (!docData.source) docData.source = [];

        const isNewUser = !docSnap.exists();

        if (olympiadId && !docData.olympiad.includes(olympiadId)) {
            docData.olympiad.push(olympiadId);
        }
        if (source && !docData.source.includes(source)) {
            docData.source.push(source);
        }

        // Save the updated data for the user
        await setDoc(docRef, {
            ...docData,
            name,
            email: emailLowerCase,
            phone,
            timeStamp: new Date().toISOString(),
            isNewUser
        });

        // Do not include referral code handling

        if (isNewUser) {
            await sendEmail(
                emailLowerCase,
                import.meta.env.VITE_OLYMPIAD_WELCOME_EMAIL_TEMPLATE,
                { name, email: emailLowerCase, phone }
            );
            await sendWhatsappMessage(userDetails.phone);
        }

        setUserDetails({ name: '', email: '', phone: '' });
        alert('User data saved successfully');
    } catch (error) {
        alert('Error storing data in Firestore: ' + error);
        console.error('Error storing data in Firestore:', error);
    }
};


  const options: RazorpayOptions = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: (discountedPrice * 100).toString(),
    name: "upEducators",
    description: "upEducators Olympiad",
    image: "https://www.upeducators.com/wp-content/uploads/2022/01/Upeducator-logo-tech-for-educators.png",
    handler: (response) => {
      handleSubmit(response).then(() => {
        setTimeout(() => navigate('/'), 2000);
      });
    },
    prefill: {
      name: userDetails.name,
      contact: userDetails.phone,
      email: userDetails.email
    },
    notes: { address: "" },
    theme: {
      color: "#F37254",
      hide_topbar: false
    }
  };

  const openPayModal = async () => {
    if (isFormValid && urlParams.olympiad) {
      const emailLowerCase = userDetails.email.toLowerCase();

      // Fetch existing document data for the user
      const docRef = doc(firestore, 'OlympiadUsers', emailLowerCase);
      const docSnap = await getDoc(docRef);

      // If user document exists
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const olympiadFromUser = userData.olympiad || []; // Fetch user's olympiad data

        // Check if the first three characters of any registered olympiad match the URL parameter
        const urlOlympiadPrefix = urlParams.olympiad.slice(0, 3); // Safely slice since we checked for null
        const isMatchingOlympiad = olympiadFromUser.some((o: string) => o.slice(0, 3) === urlOlympiadPrefix);

        console.log('isMatchingOlympiad', urlOlympiadPrefix);

        if (isMatchingOlympiad) {
          alert('You are already registered for this Olympiad, Please contact admin.'); // Alert to user
          return; // Exit without opening the payment modal
        }
      }

      // If no matching Olympiad, open payment modal
      new (window as unknown as RazorpayWindow).Razorpay(options).open();
    } else {
      alert('Please fill in all required fields and make sure Olympiad ID is available.');
    }
  };



  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="container-wrapper">
      <div className="olympiad-form">
        <div className="olympiad-details gradient">
          <h2>International Maths Teachers’ Olympiad</h2>
          <p>Shaping the Future of Education with Innovation and Excellence</p>
          <img src="https://www.upeducators.com/wp-content/uploads/2024/07/Maths-Olympiad-upeducators-teachers-landing-page-educactors-1.jpg" alt="Olympiad Details" />
        </div>
        <div className="payment-form">
          <form>
            <div className="payment-form-header">
              <img src={logoWhite} className="logo-white" alt="Logo" />
              <p>International Teachers’ Olympiad</p>
              <p><strong>Payment: ₹{totalPrice}</strong></p>
              {urlParams.referralCode && <p>Amount After 10% Discount: ₹{discountedPrice}</p>}
            </div>
            <h2>Personal Details</h2>
            <div className='form-group'>
              <label htmlFor='name'>Name<span className="asterisk">*</span></label>
              <input
                type='text'
                className='form-control'
                required
                name="name"
                autoFocus
                autoComplete="off"
                onChange={e => setUserDetails({ ...userDetails, name: e.target.value })}
                value={userDetails.name}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='email'>Email<span className="asterisk">*</span></label>
              <input
                type='email'
                className='form-control'
                required
                name="email"
                autoComplete="off"
                onChange={e => setUserDetails({ ...userDetails, email: e.target.value })}
                value={userDetails.email}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='phone'>Phone<span className="asterisk">*</span></label>
              <input
                type='tel'
                className='form-control'
                required
                name="phone"
                autoComplete="off"
                onChange={e => setUserDetails({ ...userDetails, phone: e.target.value })}
                value={userDetails.phone}
              />
              <p className="input-note">Note: You will get notifications on <img src={whatsappSvg} alt="WhatsApp Icon" /> </p>
            </div>
            <div className='form-group'>
              <Button title="Pay Now" type="button" onClick={openPayModal} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;

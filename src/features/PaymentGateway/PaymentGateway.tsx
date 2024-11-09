import { useState, useEffect } from "react";
import Button from "../../components/Buttons/Button";
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import { useNavigate } from "react-router-dom";
import { sendEmail } from "../SendEmail/SendEmail";
// import { sendWhatsappMessage } from "../SendWhatsappMessage/SendWhatsappMessage";
import whatsappSvg from "../../assets/whatsappSvg.svg";
import logoWhite from "../../assets/logo-white.png";
import Loader from "../../components/Loader/Loader";

import './PaymentGateway.css';

type RazorpayOptions = {
  key: string;
  amount: string;
  name: string;
  description: string;
  image: string;
  handler: (response?: { razorpay_payment_id?: string }) => void;
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

type UrlParams = {
  referralCode: string | null;
  source: string | null;
  olympiad: string | null;
};

const PaymentGateway = () => {
  const [userDetails, setUserDetails] = useState({ name: '', email: '', phone: '' });
  const [isFormValid, setIsFormValid] = useState(false);
  const [urlParams, setUrlParams] = useState<UrlParams>({ referralCode: null, source: null, olympiad: null });
  const totalPrice = 2;
  const [discountedPrice, setDiscountedPrice] = useState(totalPrice);
  const [loading, setLoading] = useState(false);
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

  const checkOlympiadMatch = async () => {
    const urlOlympiad = urlParams.olympiad;
    if (!urlOlympiad) {
      console.warn('Olympiad parameter is missing in the URL.');
      return false;
    }

    try {
      const emailLowerCase = userDetails.email.toLowerCase();
      const docRef = doc(firestore, 'OlympiadUsers', emailLowerCase);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const userOlympiads = userData.olympiad || [];
        if (userOlympiads.includes(urlOlympiad)) {
          alert('You are already registered for this Olympiad.');
          return true;
        }
        return false;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    const canRegister = await checkOlympiadMatch();
    if (canRegister) return;

    const { name, email, phone } = userDetails;
    const emailLowerCase = email.toLowerCase();
    const olympiadId = urlParams.olympiad;
    const source = urlParams.source;
    const referralCode = urlParams.referralCode;

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

      if (olympiadId && !docData.olympiad.includes(olympiadId)) {
        docData.olympiad.push(olympiadId);
      }
      if (source && !docData.source.includes(source)) {
        docData.source.push(source);
      }

      await setDoc(docRef, {
        ...docData,
        name,
        email: emailLowerCase,
        phone,
        timeStamp: new Date().toISOString(),
      });

      if (referralCode) {
        // Query all documents in the OlympiadUsers collection to find the referrer
        const usersCollection = collection(firestore, 'OlympiadUsers');
        const querySnapshot = await getDocs(usersCollection);

        let referrerEmail = null;

        querySnapshot.forEach((doc: any) => {
          const data = doc.data();
          if (data.referral && data.referral.includes(referralCode)) {
            referrerEmail = doc.id;  // Document ID is the email of the referrer
          }
        });

        if (referrerEmail) {
          // Fetch the referrer's document
          const referrerDocRef = doc(firestore, 'OlympiadUsers', referrerEmail);
          const referrerDocSnap = await getDoc(referrerDocRef);

          if (referrerDocSnap.exists()) {
            const referrerData = referrerDocSnap.data();

            // Log referrer's email for debugging
            console.log('Referrer found:', referrerEmail);

            // Initialize referrerUsers array if it doesn't exist
            if (!referrerData.referrerUsers) referrerData.referrerUsers = [];

            // Log the action of storing the new user's email
            if (!referrerData.referrerUsers.includes(emailLowerCase)) {
              const referrerUsersDetails = {
                email: emailLowerCase,
                name: userDetails.name,
                timestamp: new Date().toISOString()
              };

              referrerData.referrerUsers.push(JSON.stringify(referrerUsersDetails));
              // referrerData.referrerUsers.push(emailLowerCase + 'N_' + userDetails.name + 'D_' + new Date().toISOString());
              await setDoc(referrerDocRef, referrerData);
              console.log('Stored new user email in referrer document:', emailLowerCase);
            }
          } else {
            console.log('Referrer document not found for email:', referrerEmail);
          }
        } else {
          console.log('No referrer found for referral code:', referralCode);
        }
      }

      await sendEmail(emailLowerCase, import.meta.env.VITE_OLYMPIAD_WELCOME_EMAIL_TEMPLATE, { name, email: emailLowerCase, phone });
      //await sendWhatsappMessage(userDetails.phone);

      setUserDetails({ name: '', email: '', phone: '' });
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
    handler: async () => {
      setLoading(true); // Start loader
      await handleSubmit();
      setLoading(false); // Stop loader
      navigate('/'); // Redirect after loader is hidden
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
      const docRef = doc(firestore, 'OlympiadUsers', emailLowerCase);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const olympiadFromUser = userData.olympiad || [];
        const urlOlympiadPrefix = urlParams.olympiad.slice(0, 3);
        const isMatchingOlympiad = olympiadFromUser.some((o: string) => o.slice(0, 3) === urlOlympiadPrefix);

        if (isMatchingOlympiad) {
          alert('You are already registered for this Olympiad, Please contact admin.');
          return;
        }
      }

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

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="container-wrapper">
      {loading && <Loader />}
      <div className="olympiad-form">
        <div className="olympiad-details gradient">
          <h2>International Teachers’ Olympiad</h2>
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

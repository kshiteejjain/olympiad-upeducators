import { useState, useEffect } from "react";
import Button from "../../components/Buttons/Button";
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import { useNavigate } from "react-router-dom";
import { sendEmail } from "../SendEmail/SendEmail";
import { sendWhatsappMessage } from "../SendWhatsappMessage/SendWhatsappMessage";

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

// Define type for the global Razorpay object
type RazorpayWindow = Window & {
  Razorpay: new (options: RazorpayOptions) => {
    open: () => void;
  };
};

const PaymentGateway = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const totalPrice = 2;
  const [discountedPrice, setDiscountedPrice] = useState<number>(2);
  const navigate = useNavigate();
  // Validate form fields
  const validateForm = () => {
    const { name, email, phone } = userDetails;
    setIsFormValid(name !== '' && email !== '' && phone !== '');
  };

  useEffect(() => {
    validateForm();
  }, [userDetails]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const rfrlCde = urlParams.get('rfrlCde');
    if (rfrlCde) {
      setReferralCode(rfrlCde);
      if (rfrlCde === 'jkdjhf87') {
        const discount = totalPrice * 10 / 100;
        setDiscountedPrice(totalPrice - discount);
      }
    }
  }, [totalPrice]);

  const handleSubmit = async (paymentDetails: any) => {
    try {
      const { name, email, phone } = userDetails;

      // Convert email to lowercase
      const emailLowerCase = email.toLowerCase();

      // Create a new user document
      await setDoc(doc(firestore, 'OlympiadUsers', emailLowerCase), {
        name,
        email: emailLowerCase,
        phone,
        timeStamp: new Date().toISOString(),
        paymentDetails
      });

      await sendEmail(emailLowerCase, import.meta.env.VITE_OLYMPIAD_WELCOME_EMAIL_TEMPLATE);
      await sendWhatsappMessage(phone);
      // Clear the form fields
      setUserDetails({
        name: '',
        email: '',
        phone: ''
      });

      alert('User data saved successfully');
    } catch (error) {
      alert('Error storing data in Firestore: ' + error);
    }
  };

  const options: RazorpayOptions = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: (discountedPrice * 100).toString(),
    name: "upEducators",
    description: "upEducators Olympiad",
    image: "https://www.upeducators.com/wp-content/uploads/2022/01/Upeducator-logo-tech-for-educators.png",
    handler: function (response) {
      handleSubmit(response);
      setTimeout(() => {
        navigate('/')
      }, 2000);
    },
    prefill: {
      name: userDetails.name,
      contact: userDetails.phone,
      email: userDetails.email
    },
    notes: {
      address: ""
    },
    theme: {
      color: "#F37254",
      hide_topbar: false
    }
  };

  const openPayModal = () => {
    if (isFormValid) {
      const rzp1 = new (window as unknown as RazorpayWindow).Razorpay(options);
      rzp1.open();
    } else {
      alert('Please fill in all required fields.');
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="container-wrapper">
      <div className="olympiad-form">
        <div className="olympiad-details gradient">
          <h2>International Maths Teachers’ Olympiad</h2>
          <p>Shaping the Future of Education with Innovation and Excellence</p>
          <img src="https://www.upeducators.com/wp-content/uploads/2024/07/Maths-Olympiad-upeducators-teachers-landing-page-educactors-1.jpg" />
        </div>
        <form>
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
              value={userDetails.name}
              onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
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
              value={userDetails.email}
              onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='phone'>Phone<span className="asterisk">*</span></label>
            <input
              type='tel'
              className='form-control phone'
              required
              name="phone"
              autoComplete="off"
              value={userDetails.phone}
              onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
            />
          </div>
          <p>Total Payment: ₹{totalPrice}</p>
          {referralCode === 'jkdjhf87' && <p>Amount After 10% Dicsount: ₹{discountedPrice}</p>}
          <Button
            title="Pay Now"
            onClick={openPayModal}
            type='button'
            isDisabled={!isFormValid}
          />
        </form>
      </div>
    </div>
  );
};

export default PaymentGateway;

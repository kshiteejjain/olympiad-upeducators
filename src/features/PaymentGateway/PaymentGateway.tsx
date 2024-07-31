import { useState, useEffect } from "react";
import Button from "../../components/Buttons/Button";
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';

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

  // Validate form fields
  const validateForm = () => {
    const { name, email, phone } = userDetails;
    setIsFormValid(name !== '' && email !== '' && phone !== '');
  };

  useEffect(() => {
    validateForm();
  }, [userDetails]);

  const handleSubmit = async () => {
    try {
      const { name, email, phone } = userDetails;

      // Create a new user document
      await setDoc(doc(firestore, 'OlympiadUsers', phone), {
        name,
        email,
        phone,
        timeStamp: new Date().toISOString()
      });

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
    amount: "100", // = INR 1
    name: "upEducators",
    description: "upEducators Olympiad",
    image: "https://www.upeducators.com/wp-content/uploads/2022/01/Upeducator-logo-tech-for-educators.png",
    handler: function(response) {
      alert('Payment ID: ' + response.razorpay_payment_id);
      handleSubmit(); // Call handleSubmit after successful payment
    },
    prefill: {
      name: userDetails.name,
      contact: userDetails.phone,
      email: userDetails.email
    },
    notes: {
      address: "Ahmedabad"
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
    <div className="login-form">
      <h1>Proceed to Payment</h1>
      <form>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            className='form-control'
            required
            name="name"
            autoFocus
            value={userDetails.name}
            onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            className='form-control'
            required
            name="email"
            value={userDetails.email}
            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='phone'>Phone</label>
          <input
            type='tel'
            className='form-control'
            required
            name="phone"
            value={userDetails.phone}
            onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
          />
        </div>
        <Button 
          title="Pay" 
          onClick={openPayModal} 
          type='button' 
          isDisabled={!isFormValid}
        />
      </form>
    </div>
  );
};

export default PaymentGateway;

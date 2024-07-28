import { useEffect } from "react";
import Button from "../../components/Buttons/Button";

// Define types for Razorpay options and response
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
  const options: RazorpayOptions = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: "100", // = INR 1
    name: "upEducators",
    description: "upEducators Olympiad",
    image: "https://cdn.razorpay.com/logos/7K3b6d18wHwKzL_medium.png",
    handler: function(response) {
      alert(response.razorpay_payment_id);
    },
    prefill: {
      name: "Kshiteej",
      contact: "919022058508",
      email: "kshiteejjain@gmail.com"
    },
    notes: {
      address: "Ahmedabad"
    },
    theme: {
      color: "#F37254",
      hide_topbar: false
    }
  };

  const openPayModal = (options: RazorpayOptions) => {
    const rzp1 = new (window as unknown as RazorpayWindow).Razorpay(options);
    rzp1.open();
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <Button title="Pay" onClick={() => openPayModal(options)} type='button' />
    </>
  );
};

export default PaymentGateway;

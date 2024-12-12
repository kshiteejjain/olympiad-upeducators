import axios from 'axios';

const { 
  VITE_GUPSHUP_WHATSAPP_API_URL, 
  VITE_GUPSHUP_WHATSAPP_API_USER_ID, 
  VITE_GUPSHUP_WHATSAPP_API_PASSWORD, 
  VITE_GUPSHUP_WHATSAPP_API_METHOD 
} = import.meta.env;

export const sendWhatsappMessage = async (phone: string, var1: string, var2: string, var3: string, var4: string) => {
  const url = `${VITE_GUPSHUP_WHATSAPP_API_URL}?` +
    `userid=${VITE_GUPSHUP_WHATSAPP_API_USER_ID}&` +
    `password=${VITE_GUPSHUP_WHATSAPP_API_PASSWORD}&` +
    `send_to=${phone}&v=1.1&format=json&msg_type=TEXT&` +
    `method=${VITE_GUPSHUP_WHATSAPP_API_METHOD}&isTemplate=true&` +
    `header=${encodeURIComponent('Exam Reminder for Pre-Primary Teachers Olympiad')}&` +
    `footer=${encodeURIComponent('Regards, Team upEducators')}&` +
    `template_id=7260673&` +
    `var1=${encodeURIComponent(var1)}&` +
    `var2=${encodeURIComponent(var2)}&` +
    `var3=${encodeURIComponent(var3)}` +
    `var4=${encodeURIComponent(var4)}`;

  try {
    await axios.get(url); // Send the GET request
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
  }
};

export const sendWhatsappMessageOTP = async (phone: string, var1: string) => {
  const url = `${VITE_GUPSHUP_WHATSAPP_API_URL}?` +
    `userid=${VITE_GUPSHUP_WHATSAPP_API_USER_ID}&` +
    `password=${VITE_GUPSHUP_WHATSAPP_API_PASSWORD}&` +
    `send_to=${phone}&v=1.1&format=json&msg_type=TEXT&` +
    `method=${VITE_GUPSHUP_WHATSAPP_API_METHOD}&isTemplate=true&` +
    `template_id=7261127&` +
    `var1=${encodeURIComponent(var1)}&`;

  try {
    await axios.get(url); // Send the GET request
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
  }
};

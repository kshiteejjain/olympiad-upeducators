import axios from 'axios';

// Function to send a WhatsApp message with a static phone number
const { VITE_GUPSHUP_WHATSAPP_API_URL, VITE_GUPSHUP_WHATSAPP_API_USER_ID, VITE_GUPSHUP_WHATSAPP_API_PASSWORD, VITE_GUPSHUP_WHATSAPP_API_METHOD } = import.meta.env;
export const sendWhatsappMessage = async (phoneNumber: string) => {
  const url = `${VITE_GUPSHUP_WHATSAPP_API_URL}?userid=${VITE_GUPSHUP_WHATSAPP_API_USER_ID}&password=${VITE_GUPSHUP_WHATSAPP_API_PASSWORD}&send_to=${phoneNumber}&v=1.1&format=json&msg_type=TEXT&method=${VITE_GUPSHUP_WHATSAPP_API_METHOD}&template_id=7081793`;

  try {
    const { data } = await axios.get(url);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
import axios from 'axios';

// Function to send a WhatsApp message with a static phone number
const { VITE_GUPSHUP_WHATSAPP_API_URL, VITE_GUPSHUP_WHATSAPP_API_USER_ID, VITE_GUPSHUP_WHATSAPP_API_PASSWORD, VITE_GUPSHUP_WHATSAPP_API_METHOD } = import.meta.env;
export const sendWhatsappMessage = async (phoneNumber: string) => {
  const url = `${VITE_GUPSHUP_WHATSAPP_API_URL}?userid=${VITE_GUPSHUP_WHATSAPP_API_USER_ID}&password=${VITE_GUPSHUP_WHATSAPP_API_PASSWORD}&send_to=${phoneNumber}&v=1.1&format=json&msg_type=TEXT&method=${VITE_GUPSHUP_WHATSAPP_API_METHOD}&msg=Dear+Kshiteej%2C%0A%0A%F0%9F%91%89+Thank+you+for+registering+for+the+%2AInternational+Maths+Teachers%27+Olympiad%2A+with+upEducators.%0A%0ATo+access+the+important+details+regarding+Olympiad+such+as+Guidelines%2C+Sample+papers+click+ed.upeducators.com%2Folmpiad.%0A%0AFor+any+queries%2C+mail+on+olympiad%40upeducators.com%0A%0ARegards%2C%0ATeam+upEducators&isTemplate=true&header=Thank+you+for+registering+for+the+Olympiad+with+upEducators`;

  try {
    const { data } = await axios.get(url);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
import axios from 'axios';
import Button from '../../components/Buttons/Button';

const SendWhatsappMessage = () => {
  const { VITE_GUPSHUP_WHATSAPP_API_URL, VITE_GUPSHUP_WHATSAPP_API_USER_ID, VITE_GUPSHUP_WHATSAPP_API_PASSWORD, VITE_GUPSHUP_WHATSAPP_API_METHOD } = import.meta.env;
  const url = `${VITE_GUPSHUP_WHATSAPP_API_URL}?userid=${VITE_GUPSHUP_WHATSAPP_API_USER_ID}&password=${VITE_GUPSHUP_WHATSAPP_API_PASSWORD}&send_to=919022058508,919819860060&v=1.1&format=json&msg_type=TEXT&method=${VITE_GUPSHUP_WHATSAPP_API_METHOD}&msg=This+Olympiad+React+Test+Message&isTemplate=true&header=Welcome+To+Olympiad`;

  const sendMessage = () => {
    axios.get(url)
      .then(({ data }) => console.log(data))
      .catch(console.error);
  };

  return <Button title="Send Whatsapp Message" onClick={sendMessage} type='button' />;
};

export default SendWhatsappMessage;

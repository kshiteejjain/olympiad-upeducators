import { ChangeEvent, useState } from 'react';
import axios from 'axios';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestore } from './utils/firebase';
import emailjs from '@emailjs/browser';
import Button from './components/buttons/Button';

import './App.css';

const App = () => {
  const [loading, setLoading] = useState(false);


  const OlympiadSendMessage = {
    APIURL: 'https://media.smsgupshup.com/GatewayAPI/rest',
    password: 'H83geqwa',
    sendTo: '919022058508,919819860060',
    userid: '2000233871',
    method: 'SENDMESSAGE',
    msg: 'This+Olympiad+React+Test+Message',
    header: 'Welcome+To+Olympiad'
  };

  const { APIURL, password, sendTo, userid, method, msg, header } = OlympiadSendMessage;

  const url = `${APIURL}?userid=${userid}&password=${password}&send_to=${sendTo}&v=1.1&format=json&msg_type=TEXT&method=${method}&msg=${msg}&isTemplate=true&header=${header}`;


  const sendMessage = () => {
    axios.get(url)
      .then(({ data }) => console.log(data))
      .catch(err => console.error(err));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Directly send email without Firestore check
      emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_OLYMPIAD_EMAIL_TEMPLATE, {
        message: 'Test Olympiad',
        to_email: 'kshiteejjain@gmail.com, ankushb@upeducators.com',
      }, import.meta.env.VITE_EMAILJS_API_KEY)
        .then(response => {
          console.log('SUCCESS!', response);
          setLoading(false);
          // Perform any additional actions here, like resetting the form or redirecting
        }, error => {
          alert(`FAILED... ${error}`);
          setLoading(false);
        });
    } catch (error) {
      alert('Error sending email: ' + error);
      setLoading(false);
    }
  };


  return (
    <>
      <h1>Olympiad</h1>
      <button onClick={sendMessage}>Send Whatsapp Message</button>
      <form onSubmit={handleSubmit}>
        <Button isSecondary title='Send Email' type="button" />
      </form>
      {loading && 'Loading'}
    </>
  );
};

export default App;

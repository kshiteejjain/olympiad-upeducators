import React from 'react';
import './App.css';

const App = () => {
  const sendMessage = () => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        apikey: 'zj6z7iknnoytixtwrfwqswqzxue7tr4x'
      },
      body: new URLSearchParams({
        channel: 'whatsapp',
        source: 917834811114,
        destination: 919022058508,
        message: '{"type":"text","text":"Hello user, how are you?"}',
        'src.name': 'OpDrsoPMdp0fseLsoCzK7s24',
        disablePreview: false,
        encode: false
      })
    };

    fetch('https://api.gupshup.io/wa/api/v1/msg', options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
  };

  return (
    <>
      <h1>Olympiad</h1>
      <button onClick={sendMessage}>Send Message</button>
    </>
  );
};

export default App;

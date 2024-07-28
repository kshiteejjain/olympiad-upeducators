import SendWhatsappMessage from './features/SendWhatsappMessage/SendWhatsappMessage';
import SendEmail from './features/SendEmail/SendEmail';
import PaymentGateway from './features/PaymentGateway/PaymentGateway';
import AboutOlympiad from './features/AboutOlympiad/AboutOlympiad';

import './App.css';


const App = () => {
  return (
    <>
      <h1>Olympiad</h1>
      <SendWhatsappMessage />
      <SendEmail />
      <PaymentGateway />
      <AboutOlympiad />
    </>
  );
};

export default App;

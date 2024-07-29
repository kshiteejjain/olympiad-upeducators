import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import SendWhatsappMessage from './features/SendWhatsappMessage/SendWhatsappMessage';
// import SendEmail from './features/SendEmail/SendEmail';
// import PaymentGateway from './features/PaymentGateway/PaymentGateway';
import AboutOlympiad from './features/AboutOlympiad/AboutOlympiad';
import ReferEarn from './features/ReferEarn/ReferEarn';
import Header from './components/Header/Header';

import './App.css';



const App = () => {
  return (
    <Router>
      <div className="App">
      <Header />
        <Routes>
          <Route path="/" element={<AboutOlympiad />} />
          <Route path="/AboutOlympiad" element={<AboutOlympiad />} />
          <Route path="/ReferEarn" element={<ReferEarn />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaymentGateway from './features/PaymentGateway/PaymentGateway';
import AboutOlympiad from './features/AboutOlympiad/AboutOlympiad';
import ReferEarn from './features/ReferEarn/ReferEarn';
import Awards from './features/Awards/Awards';
import FAQ from './features/FAQ/FAQ';
import LiveMasterClass from './features/LiveMasterClass/LiveMasterClass';
import Report from './features/Report/Report';
import AboutUpEducators from './features/AboutUpEducators/AboutUpEducators';
import Login from './features/Login/Login';
import Header from './components/Header/Header';

import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
      <Header />
        <Routes>
          <Route path="/" element={<PaymentGateway />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/AboutOlympiad" element={<AboutOlympiad />} />
          <Route path="/ReferEarn" element={<ReferEarn />} />
          <Route path="/Awards" element={<Awards />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/LiveMasterClass" element={<LiveMasterClass />} />
          <Route path="/Report" element={<Report />} />
          <Route path="/AboutUpEducators" element={<AboutUpEducators />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

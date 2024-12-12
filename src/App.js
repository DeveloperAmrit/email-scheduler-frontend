import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Footer from './components/footer';
import Navbar from './components/navbar';
import Home from './pages/home';
import Admin from './pages/admin';
import About from './pages/about';
import Contact from './pages/contact';


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;

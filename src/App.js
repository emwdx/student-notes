// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import Students from './components/Students';
import Tickets from './components/Tickets';
import Footer from './Footer';

function App() {
  return (
    <div>
    <Router>
      <NavigationBar />
      <div className="container mt-3">
        <Routes>
          <Route path="/students" element={<Students />} />
          <Route path="/tickets" element={<Tickets />} />
        </Routes>
      </div>
      <Footer />
    </Router>
    </div>
  );
}

export default App;
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import Students from './components/Students';
import Tickets from './components/Tickets';
import Footer from './Footer';

function App() {
  return (
    <div>
    <Router basename="/student-notes">
      <NavigationBar />
      <div className="container mt-3">
        <Routes>
        <Route path="/" element={<Navigate to="/students" />} />
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
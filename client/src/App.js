import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pehle Signup dikhega */}
        <Route path="/" element={<Signup />} /> 
        {/* Login alag se path par rahega */}
        <Route path="/login" element={<Login />} />
        {/* Home page sirf tab jab user authenticated ho */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
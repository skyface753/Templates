import React, { createContext, useReducer } from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import { initialState, reducer } from "./store/reducer";
import Home from './pages/home';
import Navbar from './components/navbar';
import Login from './pages/login';
import Register from './pages/register';
import CheckLogin from './pages/checklogin';

export const AuthContext = createContext<any>(null);

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checklogin" element={<CheckLogin />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

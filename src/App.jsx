import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import HomePage from './component/HomePage.jsx';
import TheoryDetail from './component/TheoryDetails.jsx'; 
import RegistrationPage from './component/RegistrationPage.jsx';
import LoginPage from './component/LoginPage';
import AdminDashboard from "./component/AdminDashboard.jsx";
import NotFoundPage from "./component/NotFoundPage.jsx";
import './assets/NotFound.css';
import UserManagement from "./component/UserManagement.jsx";
import TheoryManagement from "./component/TheoryManagement.jsx";
import UserDashboard from './component//UserDashboard';
import MyTheories from './component/MyTheories';
import './assets/Form.css'; 

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/theories/:id" element={<TheoryDetail />} /> 
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/theories" element={<TheoryManagement />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/user/my-theories" element={<MyTheories />} />

      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './login';
import AdminDash from './admin/adminDashboard';
import UserDash from './user/userDashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/admin' element={<AdminDash />} />
        <Route path='/user' element={<UserDash />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


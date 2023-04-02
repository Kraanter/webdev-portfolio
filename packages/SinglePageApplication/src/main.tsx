import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import StudentLogin from './components/student/login/Login';
import './index.css';
import Docent from './routes/Docent';
import Login from './routes/Login';
import RouteGuard from './routes/RouteGuard';
import Student from './routes/Student';
import StudentRouteGuard from './routes/StudentRouteGuard';

React;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/logout" element={<RouteGuard nonAuthenticated logout />}>
        <Route index element={<Login logout />} />
      </Route>
      <Route index element={<Navigate replace to="/docent" />} />
      <Route path="/login" element={<RouteGuard nonAuthenticated />}>
        <Route path="" element={<Login />} />
      </Route>
      <Route path="/register" element={<Login register />} />
      <Route path="/docent" element={<RouteGuard />}>
        <Route path="" element={<Docent />} />
      </Route>
      <Route path="/student/login" element={<StudentRouteGuard nonAuthenticated />}>
        <Route path="" element={<StudentLogin />} />
      </Route>
      <Route path="/student" element={<StudentRouteGuard />}>
        <Route path="" element={<Student />} />
      </Route>
    </Routes>
  </BrowserRouter>
  // </React.StrictMode>
);

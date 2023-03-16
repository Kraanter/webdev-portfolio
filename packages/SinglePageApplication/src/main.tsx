import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import Docent from './routes/Docent';
import Login from './routes/Login';
import RouteGuard from './routes/RouteGuard';
import Student from './routes/Student';
import StudentRouteGuard from './routes/StudentRouteGuard';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/logout" element={<RouteGuard logout />}>
          <Route index element={<Login logout />} />
        </Route>
        <Route index element={<Navigate replace to="/docent" />} />
        <Route path="/login" element={<RouteGuard />}>
          <Route path="" element={<Login />} />
        </Route>
        <Route path="/register" element={<Login register />} />
        <Route path="/docent" element={<RouteGuard authenticated docent />}>
          <Route path="" element={<Docent />} />
        </Route>
        <Route path="/student" element={<StudentRouteGuard />}>
          <Route path="" element={<Student />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

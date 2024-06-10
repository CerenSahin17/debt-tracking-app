import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './screens/Login.tsx';
import Register from './screens/Register.tsx';
import Dashboard from './screens/Dashboard.tsx';
import PrivateRoute from './routes/PrivateRoute.tsx';
import Debts from './screens/Debts.tsx';

const App: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  console.log('user', user);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/debts"
            element={
              <PrivateRoute>
                <Debts />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};
export default App;

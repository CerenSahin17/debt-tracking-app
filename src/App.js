import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './screens/Login';
import Register from './screens/Register';
import Dashboard from './screens/Dashboard';
import PrivateRoute from './routes/PrivateRoute';
import Debts from './screens/Debts';

function App() {
  const user = useSelector((state) => state.auth.user);
  console.log('user2', user)

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

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import ActionsPage from './components/ActionsPage';
import ProtectedRoute from './components/ProtectedRoute';
import TriggerNotification from './components/TriggerNotification';
import SummaryDetail from './components/SummaryDetail';
import UserNotifications from './components/UserNotifications';
import SummaryByNotification from './components/SummaryByNotification';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route 
          path="/actions" 
          element={
            <ProtectedRoute>
              <ActionsPage />
            </ProtectedRoute>
          } 
        />
        {/* Removed userId from the route */}
        <Route path="/trigger-notification" element={<TriggerNotification />} />
        <Route path="/view-summary/:summary_id" element={<SummaryDetail />} />
        <Route path="/user_notifications" element={<UserNotifications />} />
        <Route path="/summary_by_notification/:notification_id" element={<SummaryByNotification />} />
      </Routes>
    </Router>
  );
};

export default App;

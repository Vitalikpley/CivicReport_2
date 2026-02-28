import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import SubmissionList from './pages/SubmissionList';
import SubmissionDetail from './pages/SubmissionDetail';
import PendingList from './pages/PendingList';
import SubmissionDetailModerator from './pages/SubmissionDetailModerator';
import CreateSubmission from './pages/CreateSubmission';

function PrivateRoute({ children, moderatorOnly }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (moderatorOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<SubmissionList />} />
        <Route path="submissions/:id" element={<SubmissionDetail />} />
        <Route
          path="create"
          element={
            <PrivateRoute>
              <CreateSubmission />
            </PrivateRoute>
          }
        />
        <Route
          path="moderator"
          element={
              <PrivateRoute moderatorOnly>
              <PendingList />
              </PrivateRoute>
          }
        />
        <Route
          path="moderator/submissions/:id"
          element={
            <PrivateRoute moderatorOnly>
              <SubmissionDetailModerator />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

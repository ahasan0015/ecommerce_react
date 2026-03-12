import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AtuhContex';

interface Props {
  allowedRoles: Array<'admin' | 'manager'>;
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // ইউজার লগইন না থাকলে লগইন পেজে পাঠাবে
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ইউজারের রোল যদি অনুমোদিত রোলের তালিকায় না থাকে
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />; // অথবা Unauthorized পেজ
  }

  return <Outlet />;
};

export default ProtectedRoute;
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AtuhContex';

interface Props {
  allowedRoles: Array<'admin' | 'manager'>;
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // if user not loging redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // if role is not valid
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />; 
  }

  return <Outlet />;
};

export default ProtectedRoute;
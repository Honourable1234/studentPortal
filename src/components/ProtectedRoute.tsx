import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useStudentSession } from '../context/useStudentSession';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { student } = useStudentSession();
  if (!student) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;

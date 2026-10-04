import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

/**
 * Guards private routes.
 *
 * - While the session is being restored from the httpOnly cookie we render a
 *   loader instead of bouncing the user to /login (avoids a redirect flash on
 *   a hard refresh).
 * - When unauthenticated we redirect to /login and remember where the user was
 *   heading so we can send them back after a successful sign-in.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return <LoadingScreen message="Restoring your session…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

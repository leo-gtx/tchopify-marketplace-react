import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
// pages
import Login from '../pages/authentication/Login';
import VerifiedEmail from '../pages/VerifiedEmail';

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default function AuthGuard({ children }) {
  const authedUser = useSelector((state)=>state.authedUser)
  const { isAuthenticated, emailVerified } = authedUser;
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);
  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  if (isAuthenticated && !emailVerified) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <VerifiedEmail />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}

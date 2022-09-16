import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
// pages
import PhoneVerification from '../pages/authentication/PhoneVerification';

// ----------------------------------------------------------------------

CheckoutGuard.propTypes = {
  children: PropTypes.node
};

export default function CheckoutGuard({ children }) {
  const authedUser = useSelector((state)=>state.authedUser)
  const { isAuthenticated} = authedUser;
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);
  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <PhoneVerification />;
  }


  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}

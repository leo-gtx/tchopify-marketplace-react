import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import ShopLayout from '../layouts/shop';
// guards
import CheckoutGuard from '../guards/CheckoutGuards';
// components
import LoadingScreen from '../components/LoadingScreen';


// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    // Auth Routes
    {
      path: 'auth',
      children: [
        { path: 'verify', element: <VerifyCode /> },
        { path: 'phone-verification', element: <PhoneVerification/>}
      ]
    },
    // Shop routes
    {
      path: '/',
      element: (
          <ShopLayout/>
      ),
      children: [
        { path: '/', element: <ShopHome/>},
        { path: '/:name/:id', element: <ShopDetails/>},
        { path: '/checkout', element: (
          <CheckoutGuard>
            <Checkout/>
          </CheckoutGuard>
        )},
        {
          path: '/orders/:id/details', element: (
            <CheckoutGuard>
              <OrderDetail/>
            </CheckoutGuard>
          )
        },
        {
          path: '/orders/:id/tracking', element: (
            <CheckoutGuard>
              <OrderTracking/>
            </CheckoutGuard>
          )
        },
        {
          path: '/account',element: (
            <CheckoutGuard>
              <CustomerAccount/>
            </CheckoutGuard>
          )
        }
      ]
    },
    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS

// ---- Authentication -------
const VerifyCode = Loadable(lazy(() => import('../pages/authentication/VerifyCode')));
const PhoneVerification = Loadable(lazy(()=> import('../pages/authentication/PhoneVerification')));

// -----Additionnal-----
const NotFound = Loadable(lazy(() => import('../pages/Page404')));

// ------Shop------
const ShopHome = Loadable(lazy(()=>import('../pages/shop/Home')));
const ShopDetails = Loadable(lazy(()=>import('../pages/shop/ShopDetails')));
const Checkout = Loadable(lazy(()=>import('../pages/shop/Checkout')));
const OrderDetail = Loadable(lazy(()=>import('../pages/shop/Invoice')));
const CustomerAccount = Loadable(lazy(()=>import('../pages/shop/UserAccount')));
const OrderTracking = Loadable(lazy(()=>import('../pages/shop/Tracking')));


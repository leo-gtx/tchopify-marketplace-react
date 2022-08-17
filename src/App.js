// routes

import Router from './routes';
// theme
import ThemeConfig from './theme';
// components
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import ThemePrimaryColor from './components/ThemePrimaryColor';
import LoadingScreen from './components/LoadingScreen';
import NotistackProvider from './components/NotistackProvider';
import ErrorBoundary from './components/ErrorBoundary';
// hook
import useAuth from './hooks/useAuth';
import useNotification from './hooks/useNotification';



// ----------------------------------------------------------------------

export default function App() {
  const {initializing} = useAuth();
  useNotification();
  
  return (
    <ThemeConfig>
      <ThemePrimaryColor>
        <RtlLayout>
          <NotistackProvider>
            <ScrollToTop />
            <ErrorBoundary>
              {
               !initializing? <Router />: <LoadingScreen/>
              }
            </ErrorBoundary>
          </NotistackProvider>
        </RtlLayout>
      </ThemePrimaryColor>
    </ThemeConfig>
  );
}

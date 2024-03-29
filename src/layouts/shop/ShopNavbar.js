import PropTypes from 'prop-types';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Box, Stack, AppBar, Toolbar, Button, Link, IconButton } from '@material-ui/core';
import { useSelector} from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
// hooks
import useCollapseDrawer from '../../hooks/useCollapseDrawer';

// components
import { MHidden } from '../../components/@material-extend';
// import Searchbar from './Searchbar';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
import LogoFull from '../../components/LogoFull';
import LocationPopup from './LocationPopup';
// routes
import { PATH_AUTH, PATH_MARKETPLACE } from '../../routes/paths';
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 0;
const COLLAPSE_WIDTH = 102;

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

ShopNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function ShopNavbar({ onOpenSidebar }) {
  const { t } = useTranslation();
  const { isCollapse } = useCollapseDrawer();
  const {isAuthenticated} = useSelector(state=>state.authedUser)
  return (
    <RootStyle
      sx={{
        ...(isCollapse && {
          width: { lg: `calc(100% - ${COLLAPSE_WIDTH}px)` }
        })
      }}
    >
      <ToolbarStyle>
        <MHidden width="lgUp">
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>
        
        <Stack direction="row" alignItems="flex-start" spacing={{ xs: 0.5, sm: 1.5 }}>
          <Link to={PATH_MARKETPLACE.home.root} component={RouterLink}>
           <LogoFull />
          </Link>
        </Stack>
        
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <LocationPopup/>
          <LanguagePopover/>
          {
            isAuthenticated ? 
              <>
                <NotificationsPopover/>
              </>
              :
                <Button variant='text' href={PATH_AUTH.phoneLogin} >{t('common.signin')}</Button>
            
          }
          
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}

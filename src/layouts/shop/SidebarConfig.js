import carFill from '@iconify/icons-eva/car-fill';
// routes
import { PATH_MARKETPLACE } from '../../routes/paths';

// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
  home: getIcon('ic_home'),
  wallet: getIcon('ic_wallet'),
  configuration: getIcon('ic_configuration'),
  marketing: getIcon('ic_marketing'),
  order: getIcon('ic_order')
};

const sidebarConfig = [
  {
    subheader: '',
    items: [
      { title: 'My Orders', icon: ICONS.order, path: PATH_MARKETPLACE.home.orders },

    ]
  }
  
];

export default sidebarConfig;

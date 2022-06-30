// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}
const ROOTS_AUTH = '/auth';
const ROOTS_MARKETPLACE = '/';

// ----------------------------------------------------------------------
export const PATH_AUTH = {
  root: ROOTS_AUTH,
  verify: path(ROOTS_AUTH, '/verify'),
  phoneLogin: path(ROOTS_AUTH, '/phone-verification'),
};


export const PATH_MARKETPLACE = {
  home: {
    root: ROOTS_MARKETPLACE,
    checkout: path(ROOTS_MARKETPLACE, '/checkout'),
    orders: path(ROOTS_MARKETPLACE, '/account?tabName=orders'),
    account: path(ROOTS_MARKETPLACE, '/account?tabName=general')
  },
  
}
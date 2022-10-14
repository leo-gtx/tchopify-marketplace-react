import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import chevronUpFill from '@iconify/icons-eva/chevron-up-fill';
import chevronDownFill from '@iconify/icons-eva/chevron-down-fill';
// material
import { Menu, Button, MenuItem, Typography } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { setSortByDish } from '../../../redux/actions/app';

// ----------------------------------------------------------------------

const SORT_BY_OPTIONS = [
  { value: 'newest', label: 'shopDetails.newest' },
  { value: 'priceDesc', label: 'shopDetails.priceDesc' },
  { value: 'priceAsc', label: 'shopDetails.priceAsc' }
];

function renderLabel(label) {
  if (label === 'newest') {
    return 'shopDetails.newest';
  }
  if (label === 'priceDesc') {
    return 'shopDetails.priceDesc';
  }
  return 'shopDetails.priceAsc';
}

export default function ShopProductSort() {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [open, setOpen] = useState(null);
  const sortBy = useSelector((state) => state.app.sortByDish);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSortBy = (value) => {
    handleClose();
    dispatch(setSortByDish(value));
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={<Icon icon={open ? chevronUpFill : chevronDownFill} />}
      >
        {t('shopDetails.sortBy')}:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {t(renderLabel(sortBy))}
        </Typography>
      </Button>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === sortBy}
            onClick={() => handleSortBy(option.value)}
            sx={{ typography: 'body2' }}
          >
            {t(option.label)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

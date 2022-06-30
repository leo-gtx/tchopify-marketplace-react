import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import checkmarkCircle2Fill from '@iconify/icons-eva/checkmark-circle-2-fill';
import closeCircleFill from '@iconify/icons-eva/close-circle-fill';
import cartFill from '@iconify/icons-eva/shopping-cart-outline';
import bagFill from '@iconify/icons-eva/shopping-bag-outline';
import clockOutline from '@iconify/icons-eva/clock-outline';
import { sumBy } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Chip, Stack, Avatar, List, ListItem, ListItemAvatar, ListItemText, Button, Typography } from '@material-ui/core';
// utils
import {  fToNow } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import useCountdown from '../../../../hooks/useCountdown';



// ----------------------------------------------------------------------

OrderItem.propTypes = {
  item: PropTypes.shape({
    billing: PropTypes.object,
    orderAt: PropTypes.number,
    total: PropTypes.number,
    cart: PropTypes.arrayOf(PropTypes.object)
  }),
  position: PropTypes.number,
  onAction1: PropTypes.func,
  onAction2: PropTypes.func,
  action1: PropTypes.shape({
    title: PropTypes.string,
    visible: PropTypes.bool,
    onAction: PropTypes.func
  }),
  action2: PropTypes.shape({
    title: PropTypes.string,
    visible: PropTypes.bool,
    onAction: PropTypes.func
  }),
};

export default function OrderItem({ item, position, action1, action2 }) {
  const {t} = useTranslation();
  const { billing, total, orderAt, cart, from, deliveryTime, status, mode, table } = item;
  const cookingTime = sumBy(cart, 'cookingTime');
  const deliveryDate = new Date(orderAt);
  deliveryDate.setMinutes(deliveryDate.getMinutes() + deliveryTime + cookingTime)
  const countdown = useCountdown(deliveryDate);
  const expired = (deliveryDate - new Date()) < 0; 
  return (
    <Stack spacing={2} sx={{ height: 'auto', position: 'relative', p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar alt={String(position)} src='#' />
        {
          mode !== 'DINE'?
          (
            <div>
              <Typography variant="subtitle1">{`${billing.receiver} (${billing.phone})`}</Typography>
              <Typography variant="subtitle2">{billing.fullAddress}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                {t('allOrders.ordered')} {fToNow(orderAt)}
              </Typography>
            </div>
          ):
          (
            <div>
            <Typography variant="subtitle1">{`Table #${table}`}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
              {t('allOrders.ordered')} {fToNow(orderAt)}
            </Typography>
          </div>
          )
        }
        
      </Stack>
      

      <Stack direction="row" flexWrap="wrap">
        <List>
        {
          cart.map((item, index)=>(
            <ListItem key={item.id + index}>
              <ListItemAvatar>
                <Avatar alt={item.name} src={item.image} />
              </ListItemAvatar>
              <ListItemText primary={item.name} secondary={`x${item.quantity} (${fCurrency(item.price)})`} />
              {item.options.map((option, index) => (
                <Chip size="small" key={index} label={option} sx={{ mr: 1, mb: 1, color: 'text.secondary' }} />
              ))}
            </ListItem>
          ))
        }
        </List>
        
        
      </Stack>
      <Stack direction='row' alignItems='center'>
        <Icon icon={cartFill} height={20} width={20} />
        <Typography variant="subtitle2">{from.name}</Typography>
      </Stack>
      <Stack direction='row' alignItems='center'>
        <Icon icon={bagFill} height={20} width={20} />
        <Typography variant="subtitle1">{fCurrency(total)}</Typography>
      </Stack>
      { mode !== 'DINE' &&  status !== 'completed' && (
        <Stack direction='row' alignItems='center'>
          <Icon icon={clockOutline} height={20} width={20} />
          <Typography variant="subtitle1" color={expired && 'red'}>{`${!expired? countdown.hours: '00'}:${!expired?countdown.minutes: '00'}:${!expired?countdown.seconds:'00'}`}</Typography>
        </Stack>
      ) }
      
      <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ flexGrow: 1 }}>
        {
          action1.visible && (
            <Button fullWidth variant="contained" endIcon={<Icon icon={checkmarkCircle2Fill} />} onClick={()=>action1?.onAction(item.id)}>
              {action1?.title}
            </Button>
          )
        }
        {
          action2.visible && (
            <Button fullWidth variant="contained" color="error" endIcon={<Icon icon={closeCircleFill} />} onClick={()=>action2?.onAction(item.id)}>
              {action2?.title}
            </Button>
          )
        }
      </Stack>
    </Stack>
  );
}
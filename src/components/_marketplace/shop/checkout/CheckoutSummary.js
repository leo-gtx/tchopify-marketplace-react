import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import editFill from '@iconify/icons-eva/edit-fill';
// material
import {
  Box,
  Card,
  Stack,
  Button,
  Divider,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  InputAdornment
} from '@material-ui/core';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
import { getCoupon } from '../../../../redux/actions/order';

// ----------------------------------------------------------------------

CheckoutSummary.propTypes = {
  total: PropTypes.number,
  discount: PropTypes.number,
  subtotal: PropTypes.number,
  shipping: PropTypes.number,
  onEdit: PropTypes.func,
  enableEdit: PropTypes.bool,
  onApplyDiscount: PropTypes.func,
  enableDiscount: PropTypes.bool,
  onGetCoupon: PropTypes.func,
  uid: PropTypes.string
};

export default function CheckoutSummary({
  total,
  onEdit,
  discount,
  subtotal,
  shipping = null,
  onApplyDiscount,
  enableEdit = false,
  enableDiscount = false,
  onGetCoupon,
  uid
}) {
  const displayShipping = shipping !== null ? 'Free' : '-';
  const { enqueueSnackbar } = useSnackbar();
  const {t} = useTranslation();
  const [code, setCode] = useState('');
  const [isLoading, setLoading] = useState(false);
  const isApplied = !!discount;
  const handleApplyCoupon = ()=>{
    setLoading(true)
    const onSuccess = (coupon)=>{
      onGetCoupon(coupon)
      onApplyDiscount(coupon.amount)
      enqueueSnackbar(t('flash.couponApplied'), {variant: 'success'})
      setLoading(false)
    }
    const onError = ()=>{
      enqueueSnackbar(t('flash.couponExpired'), {variant: 'error'})
      setLoading(false)
    }
    const data = {
      uid,
      code
    }
    getCoupon(data, onSuccess, onError)
  }
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={t('checkout.orderSummary')}
        action={
          enableEdit && (
            <Button size="small" type="button" onClick={onEdit} startIcon={<Icon icon={editFill} />}>
              {t('actions.edit')}
            </Button>
          )
        }
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('checkout.subtotal')}
            </Typography>
            <Typography variant="subtitle2">{fCurrency(subtotal)}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('checkout.discount')}
            </Typography>
            <Typography variant="subtitle2">{discount ? fCurrency(-discount) : '-'}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('checkout.shipping')}
            </Typography>
            <Typography variant="subtitle2">{shipping ? fCurrency(shipping) : displayShipping}</Typography>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">{t('checkout.total')}</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                {fCurrency(total)}
              </Typography>
              <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
              {t('checkout.noteVta')}
              </Typography>
            </Box>
          </Stack>

          {enableDiscount && (
            <TextField
              fullWidth
              value={code}
              onChange={(e)=>setCode(e.target.value)}
              disabled={isApplied}
              placeholder={t('forms.discountLabel')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button type="button" disabled={!code || isLoading || isApplied} onClick={handleApplyCoupon} sx={{ mr: -0.5 }}>
                      {
                        // eslint-disable-next-line
                        isLoading? t('actions.loading'): isApplied? t('actions.applied'): t('actions.apply')
                      }
                    </Button>
                  </InputAdornment>
                )
              }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';
import { useTranslation } from 'react-i18next';
// material
import { Card, Button, Typography, CardHeader, CardContent } from '@material-ui/core';
// redux
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

CheckoutBillingInfo.propTypes = {
  onBackStep: PropTypes.func
};

export default function CheckoutBillingInfo({ onBackStep }) {
  // const { receiver, phone, addressType, fullAddress } = billing;
  const { checkout } = useSelector((state) => state.app);
  const { billing } = checkout;
  const { t } = useTranslation();
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={t('checkout.billingAddress')}
        action={
          <Button size="small" type="button" startIcon={<Icon icon={editFill} />} onClick={onBackStep}>
            {t('actions.edit')}
          </Button>
        }
      />
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          {billing?.receiver}&nbsp;
          <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
            ({billing?.addressType})
          </Typography>
        </Typography>

        <Typography variant="body2" gutterBottom>
          {billing?.fullAddress}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {billing?.phone}
        </Typography>
      </CardContent>
    </Card>
  );
}

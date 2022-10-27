import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
import { useTranslation } from 'react-i18next';

// material
import { Box, Grid, Step, Stepper, Container, StepLabel, StepConnector } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../../redux/actions/app';

// routes
import { PATH_MARKETPLACE } from '../../routes/paths';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useSettings from '../../hooks/useSettings';

// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  CheckoutCart,
  CheckoutPayment,
  CheckoutOrderComplete,
  CheckoutBillingAddress
} from '../../components/_marketplace/shop/checkout';

// ----------------------------------------------------------------------

const STEPS = ['checkout.cart', 'checkout.billing', 'checkout.payment'];

const QontoConnector = withStyles((theme) => ({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 20px)',
    right: 'calc(50% + 20px)'
  },
  active: {
    '& $line': { borderColor: theme.palette.primary.main }
  },
  completed: {
    '& $line': { borderColor: theme.palette.primary.main }
  },
  line: {
    borderTopWidth: 2,
    borderColor: theme.palette.divider
  }
}))(StepConnector);

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool
};

function QontoStepIcon({ active, completed }) {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'primary.main' : 'divider',
        bgcolor: 'background.default'
      }}
    >
      {completed ? (
        <Box component={Icon} icon={checkmarkFill} sx={{ zIndex: 1, width: 20, height: 20, color: 'primary.main' }} />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'currentColor'
          }}
        />
      )}
    </Box>
  );
}

export default function Checkout() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const isMountedRef = useIsMountedRef();
  const { checkout } = useSelector((state) => state.app);
  const { cart, step} = checkout;
  const isComplete = step === STEPS.length;
  
  const [coupon, setCoupon] = useState();
  useEffect(() => {
    if (isMountedRef.current) {
      dispatch(getCart(cart));
    }
  }, [dispatch, isMountedRef, cart]);

  /* useEffect(() => {
    // dispatch(gotoStep(1))
    if (step === 1) {
      dispatch(createBilling(null));
      dispatch(applyShipping(null));
    }
  }, [dispatch, step]);
  */

  
  return (
    <Page title={t('titles.checkout')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('checkout.title')}
          links={[
            { name: t('links.marketplace'), href: PATH_MARKETPLACE.home.root },
            { name: t('links.checkout') }
          ]}
        />

        <Grid container justifyContent={isComplete ? 'center' : 'flex-start'}>
          <Grid item xs={12} md={8} sx={{ mb: 5 }}>
            <Stepper alternativeLabel activeStep={step} connector={<QontoConnector />}>
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={QontoStepIcon}
                    sx={{
                      '& .MuiStepLabel-label': {
                        typography: 'subtitle2',
                        color: 'text.disabled'
                      }
                    }}
                  >
                    {t(label)}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
        </Grid>

        {!isComplete ? (
          <>
            {step === 0 && <CheckoutCart handleGetCoupon={(coupon)=>setCoupon(coupon)} />}
            {step === 1 && <CheckoutBillingAddress />}
            {step === 2 && <CheckoutPayment coupon={coupon} />}
          </>
        ) : (
          <CheckoutOrderComplete open={isComplete} />
        )}
      </Container>
    </Page>
  );
}

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useFormik, Form, FormikProvider } from 'formik';
import { useSnackbar } from 'notistack5';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { Backdrop, CircularProgress, Grid, Button, DialogContent, DialogActions, DialogContentText, DialogTitle, Typography, Stack } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { gotoStep, onBackStep, onNextStep, setOrderId } from '../../../../redux/actions/app';
import { handlePlaceOrder, handlePayOrder, GetOrder, handlePlaceOrderWhatsapp } from '../../../../redux/actions/order';
import {  handleGetRestaurant } from '../../../../redux/actions/restaurant';
// hooks
import useIsMobile from '../../../../hooks/useIsMobile';
// utils
import { isStoreOpen } from '../../../../utils/utils';
// components
import CheckoutSummary from './CheckoutSummary';
import CheckoutBillingInfo from './CheckoutBillingInfo';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
import CheckoutOrderRejected from './CheckoutOrderRejected';
import { DialogAnimate } from '../../../animate';
// firebase
import firebase from '../../../../firebase';


// ----------------------------------------------------------------------

const PAYMENT_OPTIONS = [
  {
    value: 'mobile_money',
    title: 'Mobile Money',
    service: '1',
    description: 'forms.momoDescription',
    note: 'forms.momoNote',
    icons: ['/static/icons/ic_mobile_money.svg']
  },
  {
    value: 'orange_money',
    title: 'Orange Money',
    service: '2',
    description: 'forms.omDescription',
    note: 'forms.omNote',
    icons: ['/static/icons/ic_orange_money.svg']
  },
  {
    value: 'eu_mobile_money',
    title: 'EU Mobile Money',
    service: '5',
    description: 'forms.euDescription',
    icons: ['/static/icons/ic_eu_mobile_money.png']
  },
  {
      value: 'whatsapp',
      title: 'Whatsapp',
      service: '0',
      description: 'forms.whatsappDescription',
      icons: ['/static/icons/whatsapp.svg']
  }
];

// ----------------------------------------------------------------------
CheckoutPayment.propTypes = {
  coupon: PropTypes.string
}
// ----------------------------------------------------------------------

export default function CheckoutPayment({coupon}) {
  const {t} = useTranslation();
  const [from, setFrom] = useState();
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [order, setOrder] = useState();
  const [open, setOpen] = useState(false);
  const { checkout } = useSelector((state) => state.app);
  const { total, discount, subtotal, billing, cart, deliveryTime, shipping, orderId, mode  } = checkout;
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useIsMobile();

  useEffect(()=>{
    handleGetRestaurant(cart[0].shop, (data)=>setFrom(data))
  },[dispatch, setFrom, cart])

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleBackStep = () => {
    dispatch(onBackStep());
  };

  const handleGotoStep = (step) => {
    dispatch(gotoStep(step));
  };

  const handleCloseDialog = ()=> setOpen(false);
  const handleOpenDialog = ()=> setOpen(true);

  const PaymentSchema = Yup.object().shape({
    payment: Yup.mixed().required(t('forms.paymentRequired')),
    phoneNumber: Yup.string().when('payment',{
      is: (payment)=>payment.includes('money'),
      then: Yup.string().required(t('forms.phoneNumberRequired'))
    })
  });
  const formik = useFormik({
    initialValues: {
      payment: '',
      phoneNumber: ''
    },
    validationSchema: PaymentSchema,
    onSubmit: (values, { setErrors, setSubmitting }) => {

      const data = {
        orderId,
        payment: values.payment,
        shipping ,
        mode,
        billing,
        cart,
        discount,
        total,
        subtotal,
        from,
        deliveryTime: Math.round(deliveryTime / 60),
      }
        if(coupon) data.coupon = coupon;
        const paymentOption = PAYMENT_OPTIONS.find((item)=> item.value === data.payment);
        data.wallet = values.phoneNumber;
        data.service = paymentOption.service;

        if(!order && data.service !== '0'){
          const onError = ()=>{
            setSubmitting(false);
            enqueueSnackbar(t('flash.orderFailure'), {variant: 'error'})
          };
          const onSuccess = (orderId)=>{
            dispatch(setOrderId(orderId))
            enqueueSnackbar(t('flash.orderPlaced'), {variant: 'success'});
            setSubmitting(false);
          };
           // placed order
          dispatch(handlePlaceOrder(data, onSuccess, onError))
        }else if(!order && data.service ==='0'){
          const onError = ()=>{
            setSubmitting(false);
            enqueueSnackbar(t('flash.orderFailure'), {variant: 'error'})
          };
          const onSuccess = (orderId)=>{
            enqueueSnackbar(t('flash.orderPlaced'), {variant: 'success'});
            handleCloseDialog();
            setSubmitting(false);
            handleNextStep();
          };
           // placed order on whatsapp
          dispatch(handlePlaceOrderWhatsapp(data, onSuccess, onError));
        }
        else if(order?.status === 'accepted'){
          const onError = (error)=>{
            const errorMessage = error?.code ? t(`request.${error.code}`): error.message;
            setSubmitting(false);
            setErrors({ phoneNumber: errorMessage});
            setText(errorMessage);
            handleOpenDialog()
            enqueueSnackbar(t('flash.orderPayFailure'), {variant: 'error'})
          };
          const onSuccess = ()=>{
            enqueueSnackbar(t('flash.orderPaySuccess'), {variant: 'success'});
            handleCloseDialog();
            setSubmitting(false);
            handleNextStep();
          };
          // proceed to pay
          dispatch(handlePayOrder(data, onSuccess, onError))
          setText(t(paymentOption.note))
          handleOpenDialog()
        }else if(order?.status === 'rejected'){
          const onError = ()=>{
            setSubmitting(false);
            enqueueSnackbar(t('flash.orderRejected'), {variant: 'error'})
          };
          onError();
        }
        // Analytic Event
        firebase.analytics().logEvent('purchase',{
          currency: 'USD',
          value: 12.21,
          coupon
        })
    }
  });

  const { isSubmitting, handleSubmit, setFieldValue, values, errors } = formik;

  const storeOpen = from ? isStoreOpen(from?.businessHours) : true;
  useEffect(()=>{
    if(orderId) GetOrder(orderId, (data)=>{
      setOrder(data)
      setFieldValue('payment', data.payment)
    })
  },[orderId, setFieldValue])


  // This trigger a payment request when order have accepeted status
  useEffect(()=>{
    if(order?.status === 'accepted'){
      handleSubmit();
    }
  },[order?.status, handleSubmit])

  // Display then rejected's screen
  if(order?.status === 'rejected'){
    return <CheckoutOrderRejected open/>
  }

  // Analytics Event
  firebase.analytics().logEvent('add_payment_info', {
    currency: 'USD',
    value: 7.77,
    coupon,
    payment_type: PAYMENT_OPTIONS.find((item)=> item.value === values.payment)
  });

  return (
    <FormikProvider value={formik}>
      <DialogAnimate open={open} onClose={handleCloseDialog}>
        <DialogTitle>Payment Request</DialogTitle>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='inherit' onClick={handleCloseDialog}>Okay</Button>
        </DialogActions>
      </DialogAnimate>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <CheckoutPaymentMethods formik={formik}  paymentOptions={PAYMENT_OPTIONS.filter((item)=>from?.paymentOptions.includes(item.value))} />
            <Button
              type="button"
              size="small"
              color="inherit"
              onClick={handleBackStep}
              startIcon={<Icon icon={arrowIosBackFill} />}
            >
              {t('actions.back')}
            </Button>
          </Grid>

          <Grid item xs={12} md={4}>
            { mode === 'DELIVERY' && <CheckoutBillingInfo onBackStep={handleBackStep} /> }
            <CheckoutSummary
              enableEdit
              total={total}
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              onEdit={() => handleGotoStep(0)}
            />
            {
              order?.status === 'new' && (
                <Backdrop open={order?.status === 'new'} sx={{ zIndex: 9999 }}>
                  <Stack justifyContent='center' alignItems='center'>
                    <Stack>
                      <CircularProgress />
                    </Stack>
                    <Stack>
                      <Typography variant='subtitle2' sx={{textAlign: 'center', color: '#fff'}} > {t('checkout.waitingRestaurant')} </Typography>
                    </Stack>
                  </Stack>
                </Backdrop>
              )
            }
            {!isMobile && (
              <LoadingButton fullWidth size="large" disabled={!storeOpen} type="submit" variant="contained" loading={isSubmitting || order?.status === 'new'}>
                {storeOpen && !order && t('actions.completeOrder')}
                {!storeOpen && t('actions.shopClosed')}
                {storeOpen &&  order?.status === 'accepted' && t('actions.payOrder') }
              </LoadingButton>
            )}
            {
              isMobile && (
                <LoadingButton 
                  size="large" 
                  disabled={!storeOpen} 
                  type="submit" 
                  variant="contained" 
                  loading={isSubmitting || order?.status === 'new'}
                  sx={{
                    width: `${window.screen.width - 40}px`,
                    top: 'auto',
                    bottom: 20,
                    left: '50%',
                    marginLeft: `-${(window.screen.width - 40)/2}px`,
                    position: 'fixed',
                  }}
                >
                  {storeOpen && !order && t('actions.completeOrder')}
                  {!storeOpen && t('actions.shopClosed')}
                  {storeOpen &&  order?.status === 'accepted' && t('actions.payOrder') }
                </LoadingButton>
              )
            }
            
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}

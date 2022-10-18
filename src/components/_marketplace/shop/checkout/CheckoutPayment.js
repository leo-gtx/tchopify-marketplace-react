import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { sumBy, isEqual } from 'lodash';
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
import { gotoStep, onBackStep, onNextStep, applyShipping, setOrderId } from '../../../../redux/actions/app';
import { handlePlaceOrder, handlePayOrder, GetOrder } from '../../../../redux/actions/order';
import {  handleGetRestaurant } from '../../../../redux/actions/restaurant';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
import { isStoreOpen } from '../../../../utils/utils';
// components
import CheckoutSummary from './CheckoutSummary';
import CheckoutDelivery from './CheckoutDelivery';
import CheckoutBillingInfo from './CheckoutBillingInfo';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
import CheckoutOrderRejected from './CheckoutOrderRejected';
import { DialogAnimate } from '../../../animate';


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
  }
];

// ----------------------------------------------------------------------

export default function CheckoutPayment({coupon}) {
  const {t} = useTranslation();
  const [from, setFrom] = useState();
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [order, setOrder] = useState();
  const [open, setOpen] = useState(false);
  const [options, setOption] = useState([]);
  const { checkout } = useSelector((state) => state.app);
  const { total, discount, subtotal, billing, cart, deliveryTime, deliveryCost, orderId } = checkout;
  const { enqueueSnackbar } = useSnackbar();
  const cookingTime = sumBy(cart,'cookingTime');
  useEffect(()=>{
    handleGetRestaurant(cart[0].shop, (data)=>setFrom(data))
    if(from){
      if(from.mode.includes('DELIVERY')){
        options.push(
          { 
            id: 'DELIVERY',
            value: deliveryCost,
            title: t('checkout.deliveryTitle', {value: fCurrency(deliveryCost)}),
            description: t('checkout.deliveryDescription',{value: Math.round(deliveryTime / 60) + cookingTime}),
          })
      }

      if(from.mode.includes('TAKEAWAY')){
        options.push(
          {
            id: 'TAKEAWAY',
            value: 0,
            title: t('checkout.takeawayTitle'),
            description: t('checkout.takeawayDescription',{value: cookingTime}),
          })
      }

      if(from.mode.includes('DINE')){
        options.push(
          {
            id: 'DINE',
            value: 0,
            title: t('checkout.dineTitle'),
            description: t('checkout.dineDescription',{value: cookingTime}),
          })
      }
    }
  },[dispatch, setFrom, from?.mode])



  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleBackStep = () => {
    dispatch(onBackStep());
  };

  const handleGotoStep = (step) => {
    dispatch(gotoStep(step));
  };

  const handleApplyShipping = (value) => {
    dispatch(applyShipping(value));
  };
  const handleCloseDialog = ()=> setOpen(false);
  const handleOpenDialog = ()=> setOpen(true);

  const PaymentSchema = Yup.object().shape({
    payment: Yup.mixed().required(t('forms.paymentRequired')),
    delivery: Yup.mixed().required(t('forms.deliveryOptionRequired')),
    phoneNumber: Yup.string().required(t('forms.phoneNumberRequired'))
  });

  const formik = useFormik({
    initialValues: {
      delivery: undefined,
      payment: '',
      phoneNumber: ''
    },
    validationSchema: PaymentSchema,
    onSubmit: (values, { setErrors, setSubmitting }) => {

      const data = {
        orderId,
        payment: values.payment,
        shipping: options.find((item)=>item.id === values.delivery)?.value,
        mode: values.delivery,
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

        if(!order){
          const onError = (error)=>{
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
        }else if(order?.status === 'accepted'){
          const onError = (error)=>{
            console.error(error);
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
          const onError = (error)=>{
            setSubmitting(false);
            enqueueSnackbar(t('flash.orderRejected'), {variant: 'error'})
          };
          onError();
        }
    }
  });

  const { isSubmitting, handleSubmit, values, setFieldValue } = formik;
  const storeOpen = from ? isStoreOpen(from?.businessHours) : true;
  useEffect(()=>{
    if(orderId) GetOrder(orderId, (data)=>{
      setOrder(data)
      setFieldValue('delivery',data.mode)
      setFieldValue('payment', data.payment)
    })
  },[orderId])

  if(order?.status === 'rejected'){
    return <CheckoutOrderRejected open/>
  }

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
            <CheckoutDelivery
              formik={formik}
              onApplyShipping={handleApplyShipping}
              deliveryOptions={options}
            />
            <CheckoutPaymentMethods formik={formik}  paymentOptions={PAYMENT_OPTIONS} />
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
            <CheckoutBillingInfo onBackStep={handleBackStep} />
            <CheckoutSummary
              enableEdit
              total={total}
              subtotal={subtotal}
              discount={discount}
              shipping={options.find((item)=>item.id === values.delivery)?.value}
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
            <LoadingButton fullWidth size="large" disabled={!storeOpen} type="submit" variant="contained" loading={isSubmitting || order?.status === 'new'}>
              {storeOpen && !order && t('actions.completeOrder')}
              {!storeOpen && t('actions.shopClosed')}
              {storeOpen &&  order?.status === 'accepted' && t('actions.payOrder') }
            </LoadingButton>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}

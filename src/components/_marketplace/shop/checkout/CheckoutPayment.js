import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { sumBy } from 'lodash';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useFormik, Form, FormikProvider } from 'formik';
import { useSnackbar } from 'notistack5';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { Grid, Button, DialogContent, DialogActions, DialogContentText, DialogTitle } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { gotoStep, onBackStep, onNextStep, applyShipping } from '../../../../redux/actions/app';
import { handlePayAndPlaceOrder } from '../../../../redux/actions/order';
import {  handleGetRestaurant } from '../../../../redux/actions/restaurant';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
import { isStoreOpen } from '../../../../utils/utils';
// components
import CheckoutSummary from './CheckoutSummary';
import CheckoutDelivery from './CheckoutDelivery';
import CheckoutBillingInfo from './CheckoutBillingInfo';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
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
  const [open, setOpen] = useState(false);
  const { checkout } = useSelector((state) => state.app);
  const { total, discount, subtotal, billing, cart, deliveryTime, deliveryCost } = checkout;
  const { enqueueSnackbar } = useSnackbar();
  const cookingTime = sumBy(cart,'cookingTime');
  const DELIVERY_OPTIONS = [
    {
      value: deliveryCost,
      title: t('checkout.deliveryTitle', {value: fCurrency(deliveryCost)}),
      description: t('checkout.deliveryDescription',{value: Math.round(deliveryTime / 60) + cookingTime}),
    },
  ];
  useEffect(()=>{
    handleGetRestaurant(cart[0].shop, (data)=>setFrom(data))
  },[dispatch])

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
    phoneNumber: Yup.string().when("payment",{
      is: (payment) => payment !== 'pay_at_delivery',
      then: Yup.string().required(t('forms.phoneNumberRequired'))
    })
  });

  const formik = useFormik({
    initialValues: {
      delivery: undefined,
      payment: '',
      phoneNumber: ''
    },
    validationSchema: PaymentSchema,
    onSubmit: (values, { setErrors, setSubmitting }) => {
      const onError = (error)=>{
        console.error(error);
        const errorMessage = error?.code ? t(`request.${error.code}`): error.message;
        setSubmitting(false);
        setErrors({ phoneNumber: errorMessage});
        setText(errorMessage);
        handleOpenDialog()
        enqueueSnackbar(t('flash.orderFailure'), {variant: 'error'})
      };

      const onSuccess = ()=>{
        enqueueSnackbar(t('flash.orderPlaced'), {variant: 'success'});
        handleCloseDialog();
        setSubmitting(false);
        handleNextStep();
      };

      const data = {
        payment: values.payment,
        shipping: values.delivery,
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
        setText(t(paymentOption.note))
        handleOpenDialog()
        dispatch(handlePayAndPlaceOrder(data, onSuccess, onError))

    }
  });

  const { isSubmitting, handleSubmit, values } = formik;
  const storeOpen = from ? isStoreOpen(from?.businessHours) : true;
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
              deliveryOptions={DELIVERY_OPTIONS}
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
              shipping={values.delivery}
              onEdit={() => handleGotoStep(0)}
            />
            <LoadingButton fullWidth size="large" disabled={!storeOpen} type="submit" variant="contained" loading={isSubmitting}>
              {storeOpen ? t('actions.completeOrder'): t('actions.shopClosed')}
            </LoadingButton>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
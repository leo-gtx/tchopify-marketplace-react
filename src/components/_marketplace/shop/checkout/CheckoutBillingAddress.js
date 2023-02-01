import PropTypes from 'prop-types';
import { useState, useEffect, useCallback} from 'react';
import { sumBy } from 'lodash';
import { LoadingButton } from '@material-ui/lab';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import checkmark from '@iconify/icons-eva/checkmark-outline';

// material
import { Box, Grid, Button, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { onBackStep, onNextStep, createBilling, setDeliveryTime, applyShipping, createMode } from '../../../../redux/actions/app';
import { handleGetAddress, handleDeleteAddress } from '../../../../redux/actions/authedUser';
import { handleGetRestaurant } from '../../../../redux/actions/restaurant';
// hooks
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import useIsMobile from '../../../../hooks/useIsMobile';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutNewAddressForm from './CheckoutNewAddressForm';
import CheckoutDelivery from './CheckoutDelivery';
// utils
import { shippingCost } from '../../../../utils/utils'; 
import { fCurrency } from '../../../../utils/formatNumber';
// firebase
import firebase from '../../../../firebase';

// ----------------------------------------------------------------------

AddressItem.propTypes = {
  address: PropTypes.object,
  onSelectAddress: PropTypes.func,
  onDeleteAddress: PropTypes.func,
  isChecked: PropTypes.bool
};

function AddressItem({ address, onSelectAddress, onDeleteAddress, isChecked }) {
  const { receiver, fullAddress, addressType, phone, id } = address;
  const handleCreateBilling = () => {
    onSelectAddress(address);
  };

  const handleDeleteAddress = ()=>{
    onDeleteAddress(id);
  };

  const {t} = useTranslation();
  const theme = useTheme();
  return (
    <Grid
      container
      sx={{ 
        p: 3,
        mb: 3,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(2, 2.5),
        justifyContent: 'space-between',
        borderRadius: 2,
        transition: theme.transitions.create('all'),
        border: `solid 1px ${theme.palette.grey[500_32]}`
      }} 
    >
      <Grid item sm={12} md={3} sx={{ mb: 1, display: 'flex', alignItems: 'center', }}>
        <Typography variant="subtitle1">{receiver}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp;({addressType})
        </Typography>
      </Grid>
      <Grid item sm={12} md={6}>
        <Typography variant="body2" gutterBottom>
        {fullAddress}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {phone}
        </Typography>
      </Grid>

      <Grid
        item
        sm={12} 
        md={3}
        sx={{
          display: 'flex',
          right: { sm: 24 },
          bottom: { sm: 24 },
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        { isChecked ?
          (
            <Button variant="outlined" size="small" onClick={handleCreateBilling}>
              <Icon icon={checkmark} width={20} height={20} />
            </Button>
          ):
          (
            <>
              <Button variant="outlined" size="small" color="inherit" onClick={handleDeleteAddress}>
              {t('actions.delete')}
              </Button>
              <Box sx={{ mx: 0.5 }} />
              <Button variant="outlined" size="small" onClick={handleCreateBilling}>
                {t('actions.deliverAddress')}
              </Button>
            </>
          )}
      </Grid>
    </Grid>
  );
}

export default function CheckoutBillingAddress() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const { checkout } = useSelector((state) => state.app);
  const { total, discount, subtotal, cart, deliveryTime, deliveryCost, shipping, mode, billing } = checkout;
  const authedUser = useSelector((state)=>state.authedUser);
  const {addresses, id, phoneNumber} = authedUser;
  const [shop, setShop] = useState();
  const isMobile = useIsMobile();
//  const [isLoading, setLoading] = useState(true);
  const cookingTime = sumBy(cart,'cookingTime');
  const BillingSchema = Yup.object().shape({
    delivery: Yup.string().required(t('forms.deliveryOptionRequired')),
    address: Yup.object().when("delivery",{
      is: (delivery)=> delivery?.includes('DELIVERY'),
      then: Yup.object().required(t('forms.addressRequired')).typeError(t('forms.addAddress'))
    }).nullable()
  });
  const formik = useFormik({
    initialValues: {
      delivery: mode || null,
      address: billing || null
    },
    validationSchema: BillingSchema,
    onSubmit: (values, { setSubmitting }) => {
      handleCreateBilling(values.address || {phone: phoneNumber});
      dispatch(createMode(values.delivery));
      handleNextStep();
      setSubmitting(false);
    }
  });
  const { handleSubmit, setFieldValue, isSubmitting, values} = formik;
  const {address} = values;
  const shopMode = shop?.mode;
  useEffect(()=>{
    dispatch(handleGetAddress(id))
  },[dispatch, id]);
  
  const getRestaurantCallback = useCallback((data)=>{
    setShop(data)
    const deliveryOptions = [];
        if(shopMode?.includes('DELIVERY')){
          deliveryOptions.push(
            { 
              id: 'DELIVERY',
              value: shipping,
              title: t('checkout.deliveryTitle', {value: fCurrency(shipping)}),
              description: address ?
              t('checkout.deliveryDescription',{value: Math.round(deliveryTime / 60) + cookingTime}) :
              t('forms.addressRequired'),
            })
        }

        if(shopMode?.includes('TAKEAWAY')){
          deliveryOptions.push(
            {
              id: 'TAKEAWAY',
              value: 0,
              title: t('checkout.takeawayTitle'),
              description: t('checkout.takeawayDescription',{value: cookingTime}),
            })
        }
        setOptions(deliveryOptions)
  },[
    setShop, 
    shipping, 
    deliveryTime, 
    shopMode, 
    address, 
    cookingTime, 
    t, 
  ])
  const cartShop = cart[0]?.shop;
  useEffect(()=>{
    if(isMountedRef.current){
        handleGetRestaurant(cartShop, getRestaurantCallback);
    }
  },
  [
    getRestaurantCallback,
    isMountedRef,
    cartShop
  ]);

  const handleApplyShipping = useCallback((value) => {
    dispatch(applyShipping(value));
  },[dispatch]);
  const shopKmCost = shop?.kmCost;
  const distanceMatrixCallback = useCallback((result, status) => {
    if (status === "OK" ) {
      // dispatch(setDeliveryCost(shippingCost(result.rows[0].elements[0].distance.value, shop.kmCost)))
      handleApplyShipping(shippingCost(result.rows[0].elements[0].distance.value, shopKmCost)) 
      dispatch(setDeliveryTime(result.rows[0].elements[0].duration.value))
      // setLoading(false)
    }
  },[dispatch, handleApplyShipping, shopKmCost]);
  const shopLocation = shop?.location;
  const fullAddress = values.address?.fullAddress;
  useEffect(()=>{
    if(isMountedRef.current){
      const {maps} = window.google;
      const service = new maps.DistanceMatrixService();
      if(shopLocation && fullAddress){
        service.getDistanceMatrix({
        origins: [shopLocation],
        destinations: [fullAddress],
        travelMode: maps.TravelMode.DRIVING
        }, distanceMatrixCallback)
      }
    }
  },
  [
    isMountedRef,
    shopLocation, 
    fullAddress, 
    distanceMatrixCallback
  ]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNextStep = () => {
      dispatch(onNextStep());
  };

  const handleBackStep = () => {
    dispatch(onBackStep());
  };

  
  const handleCreateBilling = (value) => {
    dispatch(createBilling(value));
    firebase.analytics().logEvent('add_shipping_info',{
      currency: 'XAF',
      value: deliveryCost,
      shipping_tier: 'Groud',
    })
  };

  const handleDelete = (value)=>{
    dispatch(handleDeleteAddress(value))
  }

  const handleSelectAddress = (value)=>{
    setFieldValue('address', value)
  }

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
              <CheckoutDelivery
                formik={formik}
                onApplyShipping={handleApplyShipping}
                deliveryOptions={options}
                cardsAddress={
                  addresses && ( 
                    Object.values(addresses).map((address, index) => (
                    <AddressItem
                      key={index}
                      address={address}
                      onSelectAddress={()=>handleSelectAddress(address)}
                      onDeleteAddress={handleDelete}
                      isChecked={values.address?.id === address.id}
                    />
                  ))
                  )
                }
                onAddAddress={handleClickOpen}
              />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button size="small" color="inherit" onClick={handleBackStep} startIcon={<Icon icon={arrowIosBackFill} />}>
                {t('actions.back')}
              </Button>
              
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <CheckoutSummary subtotal={subtotal} shipping={shipping} total={total} discount={discount} />
            
            {!isMobile && 
            <LoadingButton fullWidth size="large"  type="submit" variant="contained" loading={isSubmitting}>
              {t('actions.finalizeOrder')}
            </LoadingButton>
            }
            {isMobile && 
              <LoadingButton 
                size="large"  
                type="submit" 
                variant="contained" 
                loading={isSubmitting}
                sx={{
                  width: `${window.screen.width - 40}px`,
                  top: 'auto',
                  bottom: 20,
                  left: '50%',
                  marginLeft: `-${(window.screen.width - 40)/2}px`,
                  position: 'fixed',
                }}
              >
                {t('actions.finalizeOrder')}
              </LoadingButton>
            }
          </Grid>
        </Grid>
        <CheckoutNewAddressForm
          open={open}
          onClose={handleClose}
        />
      </Form>
    </FormikProvider>
  );
}

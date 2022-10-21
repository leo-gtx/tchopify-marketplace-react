import PropTypes from 'prop-types';
import { useState, useEffect} from 'react';
import { sumBy, isEqual } from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import checkmark from '@iconify/icons-eva/checkmark-outline';

// material
import { Box, Grid, Card, Button, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { onBackStep, onNextStep, createBilling, setDeliveryCost, setDeliveryTime, applyShipping } from '../../../../redux/actions/app';
import { handleGetAddress, handleDeleteAddress } from '../../../../redux/actions/authedUser';
import { handleGetRestaurant } from '../../../../redux/actions/restaurant';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutNewAddressForm from './CheckoutNewAddressForm';
import CheckoutDelivery from './CheckoutDelivery';
// utils
import { shippingCost } from '../../../../utils/utils'; 
import { fCurrency } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

AddressItem.propTypes = {
  address: PropTypes.object,
  onLoading: PropTypes.func,
  onSelectAddress: PropTypes.func,
  onDeleteAddress: PropTypes.func,
  isChecked: PropTypes.bool
};

const AddressItemStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2.5),
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('all'),
  border: `solid 1px ${theme.palette.grey[500_32]}`
}));

function AddressItem({ address, onSelectAddress, onDeleteAddress, isChecked }) {
  const { receiver, fullAddress, addressType, phone, id } = address;
  const handleCreateBilling = () => {
    onSelectAddress(address);
  };

  const handleDeleteAddress = ()=>{
    onDeleteAddress(id);
  };

  const {t} = useTranslation();

  return (
    <AddressItemStyle sx={{ p: 3, mb: 3, position: 'relative' }}>
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1">{receiver}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp;({addressType})
        </Typography>
      </Box>
      <Typography variant="body2" gutterBottom>
        {fullAddress}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {phone}
      </Typography>

      <Box
        sx={{
          mt: 3,
          display: 'flex',
          position: { sm: 'absolute' },
          right: { sm: 24 },
          bottom: { sm: 24 }
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
      </Box>
    </AddressItemStyle>
  );
}

export default function CheckoutBillingAddress() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const { checkout } = useSelector((state) => state.app);
  const { total, discount, subtotal, cart, billing, deliveryCost, deliveryTime } = checkout;
  const authedUser = useSelector((state)=>state.authedUser);
  const {addresses, id} = authedUser;
  const [shop, setShop] = useState();
  const [isLoading, setLoading] = useState(true);
  const cookingTime = sumBy(cart,'cookingTime');

  const BillingSchema = Yup.object().shape({
    delivery: Yup.string().required(t('forms.deliveryOptionRequired')),
    address: Yup.object().required(t('forms.addressRequired'))
  });
  const formik = useFormik({
    initialValues: {
      delivery: '',
      address: null
    },
    validationSchema: BillingSchema,
    onSubmit: (values, { setErrors, setSubmitting }) => {}
  });
  const { handleSubmit, setFieldValue, values } = formik;

  useEffect(()=>{
    dispatch(handleGetAddress(id))
  },[dispatch, id]);

  useEffect(()=>{
    handleGetRestaurant(cart[0]?.shop, (data)=>setShop(data));
    if(shop){
      options.splice(0,3)
      if(shop.mode.includes('DELIVERY')){
        options.push(
          { 
            id: 'DELIVERY',
            value: deliveryCost,
            title: t('checkout.deliveryTitle', {value: fCurrency(deliveryCost)}),
            description: t('checkout.deliveryDescription',{value: Math.round(deliveryTime / 60) + cookingTime}),
          })
      }

      if(shop.mode.includes('TAKEAWAY')){
        options.push(
          {
            id: 'TAKEAWAY',
            value: 0,
            title: t('checkout.takeawayTitle'),
            description: t('checkout.takeawayDescription',{value: cookingTime}),
          })
      }

      if(shop.mode.includes('DINE')){
        options.push(
          {
            id: 'DINE',
            value: 0,
            title: t('checkout.dineTitle'),
            description: t('checkout.dineDescription',{value: cookingTime}),
          })
      }
    }
  },[setShop, setShop, shop?.mode, deliveryCost, deliveryTime])

  const service = new window.google.maps.DistanceMatrixService();
  const distanceMatrixCallback = (result, status) => {
    if (status === "OK" ) {
      dispatch(setDeliveryCost(shippingCost(result.rows[0].elements[0].distance.value, shop.kmCost)))
      dispatch(setDeliveryTime(result.rows[0].elements[0].duration.value))
      setLoading(false)
    }
  };

  useEffect(()=>{
    if(shop?.location && values.address){
       service.getDistanceMatrix({
      origins: [shop.location],
      destinations: [values.address?.fullAddress],
      travelMode: 'DRIVING'
      }, distanceMatrixCallback)
    }
   
  },[shop?.location, values.address]);

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
  };

  const handleDelete = (value)=>{
    dispatch(handleDeleteAddress(value))
  }

  const handleSelectAddress = (value)=>{
    setFieldValue('address', value)
  }

  const handleApplyShipping = (value) => {
    dispatch(applyShipping(value));
  };

  

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
                      onSelectAddress={handleSelectAddress}
                      onDeleteAddress={handleDelete}
                      isChecked={values.address?.id === address.id}
                    />
                  ))
                  )
                }
                btnAddAddress={(
                  <Button size="small" onClick={handleClickOpen} startIcon={<Icon icon={plusFill} />}>
                  {t('actions.addAddress')}
                  </Button>
                )}
              />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button size="small" color="inherit" onClick={handleBackStep} startIcon={<Icon icon={arrowIosBackFill} />}>
                {t('actions.back')}
              </Button>
              
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <CheckoutSummary subtotal={subtotal} total={total} discount={discount} />
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

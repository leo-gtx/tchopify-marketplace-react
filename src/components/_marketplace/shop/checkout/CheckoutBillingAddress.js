import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useState, useEffect, useCallback} from 'react';
import { useTranslation } from 'react-i18next';
import plusFill from '@iconify/icons-eva/plus-fill';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { Box, Grid, Card, Button, Typography } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { onBackStep, onNextStep, createBilling, setDeliveryCost, setDeliveryTime } from '../../../../redux/actions/app';
import { handleGetAddress, handleDeleteAddress } from '../../../../redux/actions/authedUser';
import { handleGetRestaurant } from '../../../../redux/actions/restaurant';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutNewAddressForm from './CheckoutNewAddressForm';
// utils
import { shippingCost } from '../../../../utils/utils'; 

// ----------------------------------------------------------------------

AddressItem.propTypes = {
  address: PropTypes.object,
  onLoading: PropTypes.func,
  onCreateBilling: PropTypes.func,
  onDeleteAddress: PropTypes.func
};

function AddressItem({ address, onLoading, onCreateBilling, onDeleteAddress, isLoading }) {
  const { receiver, fullAddress, addressType, phone, id } = address;
  const handleCreateBilling = () => {
    onLoading()
    onCreateBilling(address);
  };

  const handleDeleteAddress = ()=>{
    onDeleteAddress(id);
  };

  const {t} = useTranslation();

  return (
    <Card sx={{ p: 3, mb: 3, position: 'relative' }}>
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
          <Button variant="outlined" size="small" color="inherit" onClick={handleDeleteAddress}>
            {t('actions.delete')}
          </Button>
        <Box sx={{ mx: 0.5 }} />
        <Button variant="outlined" size="small" onClick={handleCreateBilling} disabled={isLoading}>
        { isLoading ? t('actions.loading') :t('actions.deliverAddress')}
        </Button>
      </Box>
    </Card>
  );
}

export default function CheckoutBillingAddress() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { checkout} = useSelector((state) => state.app);
  const { total, discount, subtotal, cart, billing } = checkout;
  const authedUser = useSelector((state)=>state.authedUser);
  const {addresses, id} = authedUser;
  const [shop, setShop] = useState();
  const [isLoading, setLoading] = useState(false);

  useEffect(()=>{
    dispatch(handleGetAddress(id))
  },[dispatch, id]);

  useEffect(()=>{
    handleGetRestaurant(cart[0]?.shop, (data)=>setShop(data))
  },[setShop])

  const service = new window.google.maps.DistanceMatrixService();
  const distanceMatrixCallback = (result, status) => {
    if (status === "OK" ) {
      console.log(result.rows[0].elements[0].distance.value)
      console.log(shop.kmCost)
      dispatch(setDeliveryCost(shippingCost(result.rows[0].elements[0].distance.value, shop.kmCost)))
      dispatch(setDeliveryTime(result.rows[0].elements[0].duration.value))
      handleNextStep()
      setLoading(false)
    }
  };

  useEffect(()=>{
    if(shop?.location && billing){
       service.getDistanceMatrix({
      origins: [shop.location],
      destinations: [billing.fullAddress],
      travelMode: 'DRIVING'
      }, distanceMatrixCallback)
    }
   
  },[shop?.location, billing]);

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

  const handleLoading = ()=>{
    setLoading(true)
  }


  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {addresses && Object.values(addresses).map((address, index) => (
            <AddressItem
              key={index}
              address={address}
              onLoading={handleLoading}
              onCreateBilling={handleCreateBilling}
              onDeleteAddress={handleDelete}
              isLoading={isLoading}
            />
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button size="small" color="inherit" onClick={handleBackStep} startIcon={<Icon icon={arrowIosBackFill} />}>
              {t('actions.back')}
            </Button>
            <Button size="small" onClick={handleClickOpen} startIcon={<Icon icon={plusFill} />}>
              {t('actions.addAddress')}
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
        onNextStep={handleNextStep}
        onCreateBilling={handleCreateBilling}
      />
    </>
  );
}

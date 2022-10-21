import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import linkedinFill from '@iconify/icons-eva/linkedin-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
import instagramFilled from '@iconify/icons-ant-design/instagram-filled';
import roundAddShoppingCart from '@iconify/icons-ic/round-add-shopping-cart';
import { useFormik, Form, FormikProvider, useField } from 'formik';
import { isEqual } from 'lodash';
// material
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Stack,
  Button,
  Rating,
  Tooltip,
  Divider,
  TextField,
  Typography,
  FormHelperText,
  MenuItem,
} from '@material-ui/core'; 
// redux
import { useDispatch, useSelector } from 'react-redux';
import { gotoStep, addCart} from '../../../../redux/actions/app';
// routes
import { PATH_MARKETPLACE } from '../../../../routes/paths';
// utils
import { fShortenNumber, fCurrency } from '../../../../utils/formatNumber';
import { getOptionsPrice } from '../../../../utils/utils';
//
import { MIconButton } from '../../../@material-extend';

// ----------------------------------------------------------------------

const SOCIALS = [
  {
    name: 'Facebook',
    icon: <Icon icon={facebookFill} width={20} height={20} color="#1877F2" />
  },
  {
    name: 'Instagram',
    icon: <Icon icon={instagramFilled} width={20} height={20} color="#D7336D" />
  },
  {
    name: 'Twitter',
    icon: <Icon icon={twitterFill} width={20} height={20} color="#1C9CEA" />
  }
];

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8)
  }
}));

// ----------------------------------------------------------------------

const Incrementer = (props) => {
  const [field, , helpers] = useField(props);
  // eslint-disable-next-line react/prop-types
  const { value } = field;
  const { setValue } = helpers;

  const incrementQuantity = () => {
    setValue(value + 1);
  };
  const decrementQuantity = () => {
    setValue(value - 1);
  };

  return (
    <Box
      sx={{
        py: 0.5,
        px: 0.75,
        border: 1,
        lineHeight: 0,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        borderColor: 'grey.50032'
      }}
    >
      <MIconButton size="small" color="inherit" disabled={value <= 1} onClick={decrementQuantity}>
        <Icon icon={minusFill} width={16} height={16} />
      </MIconButton>
      <Typography
        variant="body2"
        component="span"
        sx={{
          width: 40,
          textAlign: 'center',
          display: 'inline-block'
        }}
      >
        {value}
      </Typography>
      <MIconButton size="small" color="inherit"  onClick={incrementQuantity}>
        <Icon icon={plusFill} width={16} height={16} />
      </MIconButton>
    </Box>
  );
};

export default function ProductDetailsSumary({product, shopId, onToggleModal}) {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [isSubscribed, setSubscribed] = useState(false);
  const { checkout, isCheckoutViolation } = useSelector((state) => state.app);
  const {
    id,
    name,
    description,
    price,
    image,
    cookingTime,
    options,
    rating,
    totalReview,
  } = product;


  const onAddCart = (product) => {
    dispatch(addCart({...product, shop: shopId}));
  };

  const handleBuyNow = () => {
      dispatch(gotoStep(0));
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id,
      name,
      image,
      cookingTime,
      options: [],
      price,
      quantity: 1
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!alreadyProduct) {
          onAddCart({
            ...values,
            subtotal: Number(values.price) * Number(values.quantity)
          });
        }
        setSubmitting(false);
        handleBuyNow();
        navigate(PATH_MARKETPLACE.home.checkout);
      } catch (error) {
        setSubmitting(false);
      }
    }
  });

  const { values, touched, errors, getFieldProps, handleSubmit, setFieldValue } = formik;
  
  const alreadyProduct = checkout.cart.map((item) => item.id).includes(id) && isEqual(checkout.cart.find((item)=>item.id === id).options, values.options);

  const handleAddCart = () => {
    onAddCart({
      ...values,
      subtotal: values.price * values.quantity
    });
    setSubscribed(true)
  };

  useEffect(()=>{
    if(isSubscribed){
      onToggleModal(isCheckoutViolation) 
      setSubscribed(false)
    } 
  },[isSubscribed])

  return (
    <RootStyle>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

          <Typography variant="h5" paragraph>
            {name}
          </Typography>

          <Stack spacing={0.5} direction="row" alignItems="center" sx={{ mb: 2 }}>
            <Rating value={rating} precision={0.1} readOnly />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              ({fShortenNumber(totalReview)} {t('dishDetails.reviews')})
            </Typography>
          </Stack>

          <Typography variant="h4" sx={{ mb: 3 }}>
            {fCurrency(values.price)}
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            {description}
          </Typography>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Stack spacing={3} sx={{ my: 3 }}>
           

           { options.length > 0 && (
             <Stack direction="column" justifyContent="space-between">
             <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
               {t('forms.optionsLabel')}
             </Typography>
             <TextField
               select
               SelectProps={{
                 multiple: true,
                 displayEmpty: true
               }}
               size="small"
               {...getFieldProps('options')}
               onChange={(e)=>{
                setFieldValue('options', e.target.value)
                setFieldValue('price', price + getOptionsPrice(e.target.value))
               }}
               FormHelperTextProps={{
                 sx: {
                   textAlign: 'right',
                   margin: 0,
                   mt: 1
                 }
               }}
             >
               {options.map((opt) => (
                 <MenuItem key={opt} value={opt}>
                   {opt}
                 </MenuItem>
               ))}
             </TextField>
           </Stack>
           )} 

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
              {t('forms.quantityLabel')}
              </Typography>
              <div>
                <Incrementer name="quantity"  />

                <FormHelperText error>{touched.quantity && errors.quantity}</FormHelperText>
              </div>
            </Stack>
          </Stack>
          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack spacing={2} direction={{ xs: 'column', sm: 'column' }} sx={{ mt: 5 }}>
            <Button
              fullWidth
              size="large"
              type="button"
              color="warning"
              variant="contained"
              startIcon={<Icon icon={roundAddShoppingCart} />}
              onClick={handleAddCart}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {t('actions.addToCart')}
            </Button>
            <Button fullWidth size="large" type="submit" variant="contained">
              {t('actions.buyNow')}
            </Button>
          </Stack>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            {SOCIALS.map((social) => (
              <Tooltip key={social.name} title={social.name}>
                <MIconButton>{social.icon}</MIconButton>
              </Tooltip>
            ))}
          </Box>
        </Form>
      </FormikProvider>
    </RootStyle>
  );
}

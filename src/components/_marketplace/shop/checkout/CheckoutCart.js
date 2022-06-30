import { sum } from 'lodash';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { useTranslation } from 'react-i18next';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { Grid, Card, Button, CardHeader, Typography } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteCart,
  onNextStep,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity
} from '../../../../redux/actions/app';

//
import Scrollbar from '../../../Scrollbar';
import EmptyContent from '../../../EmptyContent';
import CheckoutSummary from './CheckoutSummary';
import CheckoutProductList from './CheckoutProductList';

// ----------------------------------------------------------------------

export default function CheckoutCart({handleGetCoupon}) {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { checkout } = useSelector((state) => state.app);
  const { authedUser } = useSelector((state)=>state);
  const { cart, total, discount, subtotal } = checkout;
  const isEmptyCart = cart.length === 0;

  const handleDeleteCart = (productId, options) => {
    dispatch(deleteCart(productId, options));
  };

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleApplyDiscount = (value) => {
    dispatch(applyDiscount(value));
  };

  const handleIncreaseQuantity = (productId, options) => {
    dispatch(increaseQuantity(productId, options));
  };

  const handleDecreaseQuantity = (productId, options) => {
    dispatch(decreaseQuantity(productId, options));
  };

  const handleBack = ()=>{
    navigate(-1);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { products: cart },
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        setSubmitting(true);
        handleNextStep();
      } catch (error) {
        console.error(error);
        setErrors(error.message);
      }
    }
  });

  const { values, handleSubmit } = formik;
  const totalItems = sum(values.products.map((item) => item.quantity));

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardHeader
                title={
                  <Typography variant="h6">
                    Card
                    <Typography component="span" sx={{ color: 'text.secondary' }}>
                      &nbsp;({totalItems} item)
                    </Typography>
                  </Typography>
                }
                sx={{ mb: 3 }}
              />

              {!isEmptyCart ? (
                <Scrollbar>
                  <CheckoutProductList
                    formik={formik}
                    onDelete={handleDeleteCart}
                    onIncreaseQuantity={handleIncreaseQuantity}
                    onDecreaseQuantity={handleDecreaseQuantity}
                  />
                </Scrollbar>
              ) : (
                <EmptyContent
                  title={t('checkout.emptyCart')}
                  description={t('checkout.emptyDescription')}
                  img="/static/illustrations/illustration_empty_cart.svg"
                />
              )}
            </Card>

            <Button
              color="inherit"
              onClick={handleBack}
              startIcon={<Icon icon={arrowIosBackFill} />}
            >
              {t('actions.continueShopping')}
            </Button>
          </Grid>

          <Grid item xs={12} md={4}>
            <CheckoutSummary
              total={total}
              enableDiscount
              discount={discount}
              subtotal={subtotal}
              onApplyDiscount={handleApplyDiscount}
              onGetCoupon={handleGetCoupon}
              uid={authedUser.id}
            />
            <Button fullWidth size="large" type="submit" variant="contained" disabled={values.products.length === 0}>
              {t('actions.checkout')}
            </Button>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}

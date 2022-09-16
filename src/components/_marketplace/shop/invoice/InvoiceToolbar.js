import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useFormik, FormikProvider, Form } from 'formik';
import flagFill from '@iconify/icons-ic/baseline-flag';
import starFill from '@iconify/icons-eva/star-fill';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import { useSnackbar } from 'notistack5';
// material
import {  Stack, Button, Tooltip, Grid, DialogTitle, DialogActions, DialogContent, Rating } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// components
import { DialogAnimate } from '../../../animate';
// routes
import { PATH_MARKETPLACE } from '../../../../routes/paths';

// actions
import { handleMarkAsDelivered, handleRateOrder } from '../../../../redux/actions/order';

// ----------------------------------------------------------------------

InvoiceToolbar.propTypes = {
  invoice: PropTypes.object.isRequired
};


export default function InvoiceToolbar({ invoice }) {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { status, paymentStatus, id, total, from, discount, rating } = invoice;
  const { enqueueSnackbar } = useSnackbar();
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBack = ()=>{
    navigate(PATH_MARKETPLACE.home.orders)
  }

  const handleOpenModal = ()=>{
    setOpenModal(true)
  }

  const handleCloseModal = ()=>{
    setOpenModal(false)
  }

  const handleDelivered = () => {
    setLoading(true)
    const onError = (error)=>{
      console.error(error);
      enqueueSnackbar(t('flash.error'), {variant: 'error'});
    };

    const onSuccess = ()=>{
      enqueueSnackbar(t('flash.markDelivered'), {variant: 'success'});
      handleOpenModal();
    };
    const data ={
      total: total + discount,
      owner: from.owner,
      orderId: id
    }
    handleMarkAsDelivered(data, onSuccess, onError)
  }

  const schema = Yup.object().shape({
    rating: Yup.number().required(t('forms.ratingRequired'))
  })

  const formik = useFormik({
    initialValues: {
     rating: 0
    },
    validationSchema: schema,
    onSubmit: (values, { setErrors, setSubmitting }) => {
      const onError = (error)=>{
        setSubmitting(false);
        enqueueSnackbar(t('flash.rateFailure'), {variant: 'error'})
      };

      const onSuccess = ()=>{
        enqueueSnackbar(t('flash.rateSuccess'), {variant: 'success'});
        handleCloseModal();
        setSubmitting(false);
      };
      const data ={
        orderId: id,
        rating: Number(values.rating)
      }
      handleRateOrder(data, onSuccess, onError)
    }
  });

  const { isSubmitting, handleSubmit, values, getFieldProps } = formik;


  return (
    <FormikProvider value={formik}>
       <Stack mb={5} direction="row" justifyContent="space-between" spacing={1.5}>
        <Stack>
          <Button
            type="button"
            size="small"
            color="inherit"
            onClick={handleBack}
            startIcon={<Icon icon={arrowIosBackFill} />}
          >
                  {t('actions.back')}
          </Button>
        </Stack>
        <Stack>
        {
          status === 'shipping' &&  paymentStatus === 'paid' &&
            (
              <Tooltip
                PopperProps={{
                  disablePortal: true
                }}
                open={open}
                onClose={handleClose}
                leaveDelay={5000}
                title={
                  <>
                    <Grid container spacing={2} direction='row'>
                      <Grid item sm={12} md={6}>
                      <Button variant='text' onClick={handleDelivered}>{t('actions.sure')}</Button>
                      </Grid>
                      <Grid item sm={12} md={6}>
                        <Button variant='text' color='inherit' onClick={handleClose}>{t('actions.no')}</Button>
                      </Grid>
                    </Grid>
                  </>
                }
                >
                <Button
                  color="info"
                  size="small"
                  variant="contained"
                  onClick={handleOpen}
                  endIcon={<Icon icon={flagFill} />}
                  sx={{ mx: 1 }}
                  disabled={isLoading}
                  >
                  { !isLoading? t('actions.markDelivered'):t('actions.loading')}
                </Button>
              </Tooltip>
              
            )
            
        }
        {
          status === 'completed' && (
            <Button
            color="warning"
            size="small"
            variant="contained"
            onClick={handleOpenModal}
            endIcon={<Icon icon={starFill} />}
            sx={{ mx: 1 }}
            disabled={isLoading}
            >
            { t('actions.rate')}
          </Button>
          )
        }
        </Stack>
       
       <DialogAnimate open={openModal} onClose={handleCloseModal} >
        <Form>
          <DialogTitle>{t('rating.title')}</DialogTitle>
          <DialogContent>
            <Stack alignItems='center' justifyContent='center'>
              <Rating
                label={t('forms.ratingLabel')}
                {...getFieldProps('rating')}
                size='large'
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              {t('actions.rate')}
            </LoadingButton>
          </DialogActions>
        </Form>
       </DialogAnimate>
      
      </Stack>
    </FormikProvider>
     
  );
}

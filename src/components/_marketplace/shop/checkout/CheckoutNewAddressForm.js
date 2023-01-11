import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useFormik, Form, FormikProvider } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// material
import {
  Stack,
  Radio,
  Button,
  Divider,
  TextField,
  RadioGroup,
  DialogTitle,
  DialogActions,
  FormControlLabel,
  Autocomplete,
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
//
import { DialogAnimate } from '../../../animate';
// actions
import { handleAddAddress } from '../../../../redux/actions/authedUser';

// ----------------------------------------------------------------------

CheckoutNewAddressForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function CheckoutNewAddressForm({ open, onClose })
{
  const dispatch = useDispatch();
  const {authedUser} = useSelector((state)=>state);
  const {t} = useTranslation();
  const NewAddressSchema = Yup.object().shape({
    receiver: Yup.string().required(t('forms.firstnameRequired')),
    address: Yup.string().required(t('forms.addressRequired')),
    note: Yup.string()
  });
  

  const {
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: process.env.REACT_APP_GOOGLE_PLACE_API_KEY,
     options: {
      componentRestrictions: { country: "cm" },
      types: ["establishment"],
    }
  });

  const formik = useFormik({
    initialValues: {
      addressType: 'Home',
      receiver: '',
      address: '',
      note: ''
    },
    validationSchema: NewAddressSchema,
    onSubmit: (values, { setSubmitting }) => {
      const data = {
        receiver: values.receiver,
        phone: authedUser.phoneNumber,
        fullAddress: values.address,
        note: values.note,
        addressType: values.addressType,
        userId: authedUser.id
      }
      const onSuccess = ()=>{
        onClose();
        setSubmitting(false);
      }
      const onError = () => {
        setSubmitting(false);
      }

      dispatch(handleAddAddress(data, onSuccess, onError))
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

  return (
    <DialogAnimate maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>{t('actions.addAddress')}</DialogTitle>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={{ xs: 2, sm: 3 }} sx={{ p: 3 }}>
            <RadioGroup row {...getFieldProps('addressType')}>
              <FormControlLabel value="Home" control={<Radio />} label={t('forms.home')} sx={{ mr: 2 }} />
              <FormControlLabel value="Office" control={<Radio />} label={t('forms.office')} />
              <FormControlLabel value="Away" control={<Radio />} label={t('forms.away')} />
            </RadioGroup>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label={t('forms.firstnameLabel')}
                {...getFieldProps('receiver')}
                error={Boolean(touched.receiver && errors.receiver)}
                helperText={touched.receiver && errors.receiver}
              />
            </Stack>

            <Autocomplete
              freeSolo={false}
              fullWidth
              loading={isPlacePredictionsLoading}
              options={placePredictions}
              getOptionLabel={(option)=>option.description}
              onSelect={(e)=>{
                      setFieldValue('address', e.target.value)  
           }}
              renderInput={(params)=> <TextField
              {...params}
              label={t('forms.addressLabel')}
              {...getFieldProps('address')}
              error={Boolean(touched.address && errors.address)}
              helperText={touched.address && errors.address}
              onChange={(evt) => {
                      getPlacePredictions({ input: evt.target.value })
              }}
              />}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                multiline
                minRows={5}
                maxRows={5}
                label={t('forms.addPrecision')}
                {...getFieldProps('note')}
                error={Boolean(touched.note && errors.note)}
                helperText={touched.note && errors.note}
              />
          </Stack>
          </Stack>
          <Divider />

          <DialogActions>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {t('actions.deliverAddress')}
            </LoadingButton>
            <Button type="button" color="inherit" variant="outlined" onClick={onClose}>
              {t('actions.cancel')}
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </DialogAnimate>
  );
}
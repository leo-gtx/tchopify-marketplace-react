import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import {
  Box,
  Grid,
  Card,
  Stack,
  TextField,
  Typography,
  FormHelperText,
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useSelector, useDispatch } from 'react-redux';
// hooks
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { UploadAvatar } from '../../../upload';
// actions
import { handleUpdateProfileCustomer } from '../../../../redux/actions/authedUser';
// utils
import { fData } from '../../../../utils/formatNumber';
import { resizeThumbnail } from '../../../../utils/imageResizer';
//

// ----------------------------------------------------------------------
export default function AccountGeneral() {
  const {t} = useTranslation();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector(state=>state.authedUser);
  const dispatch = useDispatch();
  const UpdateUserSchema = Yup.object().shape({
    fullname: Yup.string().required(t('forms.nameRequired')),
    phoneNumber: Yup.string().required(t('forms.phoneNumberRequired')),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullname: user.fullname || '',
      photoURL: user.avatar || {},
      phoneNumber: user.phoneNumber || '',
    },

    validationSchema: UpdateUserSchema,
    onSubmit: (values, { setErrors, setSubmitting }) => {
        const data = {
          ...values,
          image: values.photoURL.file,
          userId: user.id,
          oldAvatar: user.filename
        };
        dispatch(handleUpdateProfileCustomer(data, ()=>{
          if (isMountedRef.current) {
            setSubmitting(false);
          }
          enqueueSnackbar(t('flash.updateSuccess'), { variant: 'success' });
        }, (error)=>{
          if (isMountedRef.current) {
            setErrors({ afterSubmit: error.code });
            setSubmitting(false);
            enqueueSnackbar(t('flash.updateFailure'), { variant: 'error' });
          }
        }));

    }
  });

  const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, isValid } = formik;

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const image = await resizeThumbnail(file);
      if (image) {
        setFieldValue('photoURL', {
          file: image,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );


  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
              <UploadAvatar
                accept="image/*"
                file={values.photoURL}
                maxSize={10000000}
                onDrop={handleDrop}
                error={Boolean(touched.photoURL && errors.photoURL)}
                caption={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />

              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {touched.photoURL && errors.photoURL}
              </FormHelperText>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={{ xs: 2, md: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField fullWidth label={t('forms.nameLabel')} {...getFieldProps('fullname')} />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField 
                    fullWidth 
                    label={t('forms.phoneNumberLabel')} 
                    {...getFieldProps('phoneNumber')} 
                    disabled
                  />
                </Stack>

                
              </Stack>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton type="submit" variant="contained" disabled={!isValid || isSubmitting} loading={isSubmitting}>
                  {t('actions.saveChanges')}
                </LoadingButton>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}

import * as Yup from 'yup';
import { useState } from 'react';
import { useParams } from 'react-router';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useTranslation } from 'react-i18next';
// material
import { Stack, TextField, IconButton, InputAdornment, Alert } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// actions
import { register } from '../../../redux/actions/authedUser';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
//
import { MIconButton } from '../../@material-extend';
// utils
import { ROLES } from '../../../utils/utils';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const { t } = useTranslation();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().min(2, t('forms.minAlert')).max(50, t('forms.maxAlert')).required(t('forms.firstnameRequired')),
    lastName: Yup.string().min(2, t('forms.minAlert')).max(50, t('forms.maxAlert')).required(t('forms.lastnameRequired')),
    email: Yup.string().email(t('forms.emailInvalid')).required(t('forms.emailRequired')),
    password: Yup.string().min(6, t('forms.passwordSizeAlert')).required(t('forms.passwordRequired'))
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
        const data = {
          email: values.email,
          fullname: `${values.firstName} ${values.lastName}`,
          password: values.password,
          role: ROLES.owner.value,
        };
        const onSuccess = ()=>{
                  enqueueSnackbar(t('flash.registerSuccess'), {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        
        if (isMountedRef.current) {
          setSubmitting(false);
        }
        }
        const onError = (error)=>{
          console.error(error);
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.message });
          setSubmitting(false);
        }
      }
        await register(data, onSuccess, onError);
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label={t('forms.firstnameLabel')}
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label={t('forms.lastnameLabel')}
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label={t('forms.emailLabel')}
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label={t('forms.passwordLabel')}
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            {t('actions.register')}
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

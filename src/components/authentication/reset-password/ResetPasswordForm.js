import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
// material
import { TextField, Alert, Stack } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// actions
import { resetPassword } from '../../../redux/actions/authedUser';

// ----------------------------------------------------------------------

ResetPasswordForm.propTypes = {
  onSent: PropTypes.func,
  onGetEmail: PropTypes.func
};

export default function ResetPasswordForm({ onSent, onGetEmail }) {
  const isMountedRef = useIsMountedRef();
  const {t} = useTranslation();
  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email(t('forms.emailInvalid')).required(t('forms.emailRequired'))
  });

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: (values, { setErrors, setSubmitting }) => {
        const onSuccess = ()=>{
          if (isMountedRef.current) {
          onSent();
          onGetEmail(formik.values.email);
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
        resetPassword(values.email, onSuccess, onError)
        
      }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <TextField
            fullWidth
            {...getFieldProps('email')}
            type="email"
            label={t('forms.emailLabel')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            {t('actions.resetPassword')}
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

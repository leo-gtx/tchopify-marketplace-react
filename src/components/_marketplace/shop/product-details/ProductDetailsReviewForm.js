import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useFormik, Form, FormikProvider } from 'formik';
import { useSnackbar } from 'notistack5';
import { useSelector } from 'react-redux';
// material
import { styled } from '@material-ui/core/styles';
import { Button, Rating, TextField, Typography, FormHelperText, Stack } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// actions
import { handleAddReview, handleEditReview } from '../../../../redux/actions/reviews';
// utils 
import { isPurchased } from '../../../../utils/utils';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadiusMd,
  backgroundColor: theme.palette.background.neutral
}));

// ----------------------------------------------------------------------

ProductDetailsReviewForm.propTypes = {
  onClose: PropTypes.func,
  product: PropTypes.object,
};

export default function ProductDetailsReviewForm({ product, onClose, ...other }) {
  const { enqueueSnackbar } = useSnackbar();
  const {authedUser} = useSelector((state)=>state);
  const ReviewSchema = Yup.object().shape({
    rating: Yup.mixed().required('Rating is required'),
    review: Yup.string().required('Review is required'),
  });
  const myReviewIndex = product.reviews.findIndex((item)=>item.userId === authedUser.id);
  const isEdit = myReviewIndex !== -1;
  const formik = useFormik({
    initialValues: {
      rating: isEdit && product.reviews[myReviewIndex].rating || null,
      review: isEdit && product.reviews[myReviewIndex].comment || '',
    },
    validationSchema: ReviewSchema,
    onSubmit:(values, { resetForm, setSubmitting }) => {
      const callback = ()=>{
        onClose();
        resetForm();
        setSubmitting(false);
        enqueueSnackbar('Review Added', { variant: 'success' });
      };
      const data = {
        rating: values.rating,
        comment: values.review,
        name: authedUser.fullname,
        avatarUrl: authedUser.avatar,
        isPurchased: isPurchased(Object.values(authedUser.orders), product.id),
        dishId: product.id,
        userId: authedUser.id,
      }

      if (!isEdit){
        handleAddReview(data, callback) 
      } else {
        data.reviewId = product.reviews[myReviewIndex].id
        handleEditReview(data, callback)
      }
    }
  });

  const { errors, touched, resetForm, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const onCancel = () => {
    onClose();
    resetForm();
  };

  return (
    <RootStyle {...other}>
      <Typography variant="subtitle1" gutterBottom>
        { isEdit ? 'Edit Your Review': 'Add Review'}
      </Typography>

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={1.5}>
              <Typography variant="body2">Your review about this product:</Typography>
              <Rating
                {...getFieldProps('rating')}
                onChange={(event) => setFieldValue('rating', Number(event.target.value))}
              />
            </Stack>
            {errors.rating && <FormHelperText error>{touched.rating && errors.rating}</FormHelperText>}

            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={5}
              label="Review *"
              {...getFieldProps('review')}
              error={Boolean(touched.review && errors.review)}
              helperText={touched.review && errors.review}
            />

            <Stack direction="row" justifyContent="flex-end">
              <Button type="button" color="inherit" variant="outlined" onClick={onCancel} sx={{ mr: 1.5 }}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Post review
              </LoadingButton>
            </Stack>
          </Stack>
        </Form>
      </FormikProvider>
    </RootStyle>
  );
}

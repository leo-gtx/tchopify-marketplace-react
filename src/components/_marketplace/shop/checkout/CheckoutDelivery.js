import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import checkmarkCircle2Fill from '@iconify/icons-eva/checkmark-circle-2-fill';
import { useTranslation } from 'react-i18next';
// material
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Grid,
  Radio,
  Typography,
  RadioGroup,
  CardHeader,
  CardContent,
  FormHelperText,
  FormControlLabel
} from '@material-ui/core';

// ----------------------------------------------------------------------

const OptionStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2.5),
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('all'),
  border: `solid 1px ${theme.palette.grey[500_32]}`
}));

// ----------------------------------------------------------------------

CheckoutDelivery.propTypes = {
  formik: PropTypes.object,
  deliveryOptions: PropTypes.array,
  onApplyShipping: PropTypes.func
};

export default function CheckoutDelivery({ formik, deliveryOptions, onApplyShipping, ...other }) {
  const { values, setFieldValue, errors, touched } = formik;
  const {t} = useTranslation();
  return (
    <Card {...other}>
      <CardHeader title={t('checkout.deliveryOptions')} />
      <CardContent>
        <RadioGroup
          name="delivery"
          value={Number(values.delivery)}
          onChange={(event) => {
            const { value } = event.target;
            setFieldValue('delivery', Number(value));
            onApplyShipping(Number(value));
          }}
        >
          <Grid container spacing={2}>
            {deliveryOptions.map((delivery, index) => {
              const { value, title, description, id } = delivery;
              return (
                <Grid key={id} item xs={12} md={6}>
                  <OptionStyle
                    sx={{
                      ...(values.delivery === id && {
                        boxShadow: (theme) => theme.customShadows.z8
                      })
                    }}
                  >
                    <FormControlLabel
                      value={id}
                      control={<Radio checkedIcon={<Icon icon={checkmarkCircle2Fill} />} />}
                      label={
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="subtitle2">{title}</Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {description}
                          </Typography>
                        </Box>
                      }
                      sx={{ py: 3, flexGrow: 1, mr: 0 }}
                    />
                  </OptionStyle>
                  
                </Grid>
              );
            })}
            {errors.delivery && (
              <FormHelperText error>
                <Box component="span" sx={{ px: 2 }}>
                  {touched.delivery && errors.delivery}
                </Box>
              </FormHelperText>
            )}
          </Grid>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

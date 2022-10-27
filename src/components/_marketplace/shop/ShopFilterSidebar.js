import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Form, FormikProvider } from 'formik';
import { useTranslation } from 'react-i18next';
import closeFill from '@iconify/icons-eva/close-fill';
import roundClearAll from '@iconify/icons-ic/round-clear-all';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
// material
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Rating,
  Divider,
  Typography,
  RadioGroup,
  FormControlLabel
} from '@material-ui/core';
//
import { MIconButton } from '../../@material-extend';
import Scrollbar from '../../Scrollbar';


// ----------------------------------------------------------------------

export const SORT_BY_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' }
];

export const FILTER_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];
export const FILTER_PRICE_OPTIONS = [
  { value: 'below', label: 'Below 5000 XAF' },
  { value: 'between', label: 'Between 5000 XAF - 10000 XAF' },
  { value: 'above', label: 'Above 10000 XAF' }
];


// ----------------------------------------------------------------------

ShopFilterSidebar.propTypes = {
  isOpenFilter: PropTypes.bool,
  onResetFilter: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  formik: PropTypes.object,
  categories: PropTypes.array,
};

export default function ShopFilterSidebar({ isOpenFilter, onResetFilter, onOpenFilter, onCloseFilter, formik, categories }) {
  const {t} = useTranslation();
  const { values, getFieldProps } = formik;
  return (
    <>
      <Button disableRipple color="inherit" endIcon={<Icon icon={roundFilterList} />} onClick={onOpenFilter}>
      {t('shopDetails.filters')}&nbsp;
      </Button>

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <Drawer
            anchor="right"
            open={isOpenFilter}
            onClose={onCloseFilter}
            PaperProps={{
              sx: { width: 280, border: 'none', overflow: 'hidden' }
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                {t('shopDetails.filters')}
              </Typography>
              <MIconButton onClick={onCloseFilter}>
                <Icon icon={closeFill} width={20} height={20} />
              </MIconButton>
            </Stack>

            <Divider />

            <Scrollbar>
              <Stack spacing={3} sx={{ p: 3 }}>

                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    {t('shopDetails.category')}
                  </Typography>
                  <RadioGroup {...getFieldProps('category')}>
                  <FormControlLabel value='All' control={<Radio />} label={t('shopDetails.all')} />
                    {categories.map((item) => (
                      <FormControlLabel key={item.id} value={item.name} control={<Radio />} label={item.name} />
                    ))}
                  </RadioGroup>
                </div>


                <div>
                  <Typography variant="subtitle1" gutterBottom>
                  {t('shopDetails.price')}
                  </Typography>
                  <RadioGroup {...getFieldProps('priceRange')}>
                    {FILTER_PRICE_OPTIONS.map((item) => (
                      <FormControlLabel key={item.value} value={item.value} control={<Radio />} label={item.label} />
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Typography variant="subtitle1" gutterBottom>
                  {t('shopDetails.rating')}
                  </Typography>
                  <RadioGroup {...getFieldProps('rating')}>
                    {FILTER_RATING_OPTIONS.map((item, index) => (
                      <FormControlLabel
                        key={item}
                        value={item}
                        control={
                          <Radio
                            disableRipple
                            color="default"
                            icon={<Rating readOnly value={4 - index} />}
                            checkedIcon={<Rating readOnly value={4 - index} />}
                            sx={{
                              '&:hover': { bgcolor: 'transparent' }
                            }}
                          />
                        }
                        label="& Up"
                        sx={{
                          my: 0.5,
                          borderRadius: 1,
                          '&:hover': { opacity: 0.48 },
                          ...(values.rating.includes(item) && {
                            bgcolor: 'action.selected'
                          })
                        }}
                      />
                    ))}
                  </RadioGroup>
                </div>
              </Stack>
            </Scrollbar>

            <Box sx={{ p: 3 }}>
              <Button
                fullWidth
                size="large"
                type="submit"
                color="inherit"
                variant="outlined"
                onClick={onResetFilter}
                startIcon={<Icon icon={roundClearAll} />}
              >
                {t('shopDetails.clearAll')}
              </Button>
            </Box>
          </Drawer>
        </Form>
      </FormikProvider>
    </>
  );
}

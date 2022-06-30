import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import roundClearAll from '@iconify/icons-ic/round-clear-all';
// material
import { styled } from '@material-ui/core/styles';
import { Chip, Typography, Stack, Button } from '@material-ui/core';
// utils


// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center'
});

const WrapperStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'stretch',
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.divider}`
}));

const LabelStyle = styled((props) => <Typography component="span" variant="subtitle2" {...props} />)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  borderRight: `solid 1px ${theme.palette.divider}`
}));

// ----------------------------------------------------------------------

function labelPriceRange(range) {
  if (range === 'below') {
    return 'shopDetails.below';
  }
  if (range === 'between') {
    return 'shopDetails.between';
  }
  return 'shopDetails.above';
}

ShopTagFiltered.propTypes = {
  formik: PropTypes.object,
  filters: PropTypes.object,
  isShowReset: PropTypes.bool,
  isDefault: PropTypes.bool,
  onResetFilter: PropTypes.func
};

export default function ShopTagFiltered({ formik, filters, isShowReset, isDefault, onResetFilter }) {
  const {t} = useTranslation();
  const { values, handleSubmit, setFieldValue, initialValues } = formik;
  const { category, priceRange, rating } = filters;
  const isShow = values !== initialValues && !isShowReset;

  const handleRemoveCategory = () => {
    handleSubmit();
    setFieldValue('category', 'All');
  };


  const handleRemovePrice = () => {
    handleSubmit();
    setFieldValue('priceRange', '');
  };

  const handleRemoveRating = () => {
    handleSubmit();
    setFieldValue('rating', '');
  };

  return (
    <RootStyle>
     

      {category !== 'All' && (
        <WrapperStyle>
          <LabelStyle>{t('forms.categoryLabel')}:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" label={category} onDelete={handleRemoveCategory} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}

      {priceRange && (
        <WrapperStyle>
          <LabelStyle>{t('forms.priceLabel')}:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" label={t(labelPriceRange(priceRange))} onDelete={handleRemovePrice} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}

      {rating && (
        <WrapperStyle>
          <LabelStyle>{t('forms.ratingLabel')}:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" label={sentenceCase(rating)} onDelete={handleRemoveRating} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}

      {isShow && !isDefault && (
        <Button
          color="error"
          size="small"
          type="button"
          onClick={onResetFilter}
          startIcon={<Icon icon={roundClearAll} />}
        >
          {t('actions.clearAll')}
        </Button>
      )}
    </RootStyle>
  );
}

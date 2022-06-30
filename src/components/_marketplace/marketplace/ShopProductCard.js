import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { paramCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import eyeOff from '@iconify/icons-eva/eye-off-2-fill';
// material
import { Box, Card, Link, Typography, Stack, Rating } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
// routes
import {PATH_MARKETPLACE } from '../../../routes/paths';
//
import Label from '../../Label';
// utils 
import { isStoreOpen } from '../../../utils/utils';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object
};

export default function ShopProductCard({ product }) {
  const {t} = useTranslation();
  const { name, image, businessHours, id, rating } = product;
  const linkTo = `${PATH_MARKETPLACE.home.root}/${paramCase(name)}/${id}`;
  const isOpen = isStoreOpen(businessHours)
  return (
    <Link to={linkTo} color="inherit" underline='none' component={RouterLink}>
      <Card>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          {!isOpen && (
            <Label
              variant="filled"
              color='error'
              sx={{
                top: 16,
                right: 16,
                zIndex: 9,
                position: 'absolute',
                textTransform: 'uppercase'
              }}
            >
              <Icon icon={eyeOff} height={20} width={20} />
              {t('common.closed')}
            </Label>
          )}
          <ProductImgStyle alt={name} src={image} />
        </Box>

        <Stack spacing={2} sx={{ p: 3 }}>
          
            <Typography variant="subtitle1" noWrap>
              {name}
            </Typography>
          
          <Stack direction="column" justifyContent="flex-start">
          <Rating name='small' value={rating} precision={0.1} readOnly />
          
          </Stack>
        </Stack>
      </Card>
    </Link>
  );
}

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { paramCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import eyeOff from '@iconify/icons-eva/eye-off-2-fill';
import BlockImage from 'react-block-image';
// material
import { Box, Card, Link, Typography, Stack, Rating, CircularProgress } from '@material-ui/core';
// routes
import {PATH_MARKETPLACE } from '../../../routes/paths';
//
import Label from '../../Label';
// utils 
import { isStoreOpen } from '../../../utils/utils';

// ----------------------------------------------------------------------

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
          <BlockImage
            style={{
              top: 0,
              width: '100%',
              height: '100%',
              position: 'absolute'
            }}
            src={image || '/static/illustrations/illustration_no_store_image.jpg'}
            showPreview
            loader={
              <center style={{marginTop: '45%'}}>
                <CircularProgress/>
              </center>
            
          }
          />
        </Box>

        <Stack spacing={2} direction='row' flexWrap='wrap' sx={{ p: 3 }}>
          
            <Typography variant="subtitle1" noWrap>
              {name}
            </Typography>
          { rating && rating > 0 &&
          (
            <Stack direction="column" justifyContent="flex-start">
              <Rating name='small' value={rating} precision={0.1} emptyIcon={<Icon/>} readOnly />
            </Stack>
          )}
          
        </Stack>
      </Card>
    </Link>
  );
}

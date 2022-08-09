import PropTypes from 'prop-types';

import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import clock from '@iconify/icons-eva/clock-outline';
import BlockImage from 'react-block-image';
// material
import { Box, Card, Link, Typography, Stack, Rating, CircularProgress } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';

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
  const { name, image, price, cookingTime, id, rating  } = product;
  const linkTo = `?productId=${id}`;
  return (
    <Link to={linkTo} color="inherit" underline='none' component={RouterLink}>
      <Card>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          <BlockImage
            style={{
              top: 0,
              width: '100%',
              height: '100%',
              position: 'absolute'
            }}
            src={image}
            showPreview
            loader={
              <center style={{marginTop: '45%'}}>
                <CircularProgress/>
              </center>
            
          }
          />
        </Box>

        <Stack spacing={2} sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" noWrap>
                {name}
              </Typography>
              <Rating value={rating} readOnly/>
          </Stack>
           
          <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">
              {fCurrency(price)}
            </Typography>
            <Stack direction="row"  alignItems="center" justifyContent="space-between">
              <Icon icon={clock} width={16} height={16}/>
              <Typography variant="subtitle2">
                {`${cookingTime} min`}
              </Typography>
            </Stack>
            
          </Stack>
        </Stack>
      </Card>
    </Link>
  );
}

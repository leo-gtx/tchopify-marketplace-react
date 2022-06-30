import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// material
import { Skeleton, Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import ShopProductCard from './ShopProductCard';
import EmptyContent from '../../EmptyContent';


// ----------------------------------------------------------------------

const SkeletonLoad = (
  <Grid container spacing={3}>
    {[...Array(24)].map((_, index) => (
      <Grid item xs={12} sm={6} md={2} key={index}>
        <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '115%', borderRadius: 2 }} />
      </Grid>
    ))}
  </Grid>
);

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
  isLoad: PropTypes.bool
};

export default function ProductList({ products, isLoad, ...other }) {
  const { deliveryLocation } = useSelector((state)=>state.app);
  const {t} = useTranslation();
  return (
    <>
    {isLoad && SkeletonLoad }
    
    { !isLoad && products.length > 1 && (
      <Grid container spacing={3} {...other}>
        { products.map((product) => (
          <Grid key={product.id} item xs={12} sm={6} md={2}>
            <ShopProductCard product={product} />
          </Grid>
        ))}
        
      </Grid>
    )}
    

    { !isLoad && products.length < 1 && (
        <EmptyContent
         title={t('home.emptyContentTitle')}
         description={t('home.emptyContentTitle',{location:deliveryLocation})}
         img='/static/illustrations/illustration_empty_content.svg'
        />
      )}
    </>
    
  );
}

import { Icon } from '@iconify/react';
import PropType from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import clockFill from '@iconify/icons-eva/clock-fill';
import roundVerified from '@iconify/icons-ic/round-verified';
import roundVerifiedUser from '@iconify/icons-ic/round-verified-user';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Box, Tab, Card, Grid, Divider, Skeleton, Container, Typography, DialogTitle, DialogActions, Button, DialogContentText, DialogContent } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
// redux
import { handleGetReviews } from '../../redux/actions/reviews';
import { handleGetDish } from '../../redux/actions/dishes';
import { setCheckoutConstraint, addCart, resetCart } from '../../redux/actions/app';

// components
import Markdown from '../../components/Markdown';
import {
  ProductDetailsSumary,
  ProductDetailsReview,
  ProductDetailsCarousel
} from '../../components/_marketplace/shop/product-details';
import { DialogAnimate}  from '../../components/animate';



// ----------------------------------------------------------------------

const PRODUCT_DESCRIPTION = [
  {
    title: 'dishDetails.adsTitle1',
    description: 'dishDetails.adsSubtitle1',
    icon: roundVerified
  },
  {
    title: 'dishDetails.adsTitle2',
    description: 'dishDetails.adsSubtitle2',
    icon: clockFill
  },
  {
    title: 'dishDetails.adsTitle3',
    description: 'dishDetails.adsSubtitle3',
    icon: roundVerifiedUser
  }
];

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  justifyContent: 'center',
  height: theme.spacing(8),
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`
}));

// ----------------------------------------------------------------------

const SkeletonLoad = (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6} lg={7}>
      <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '100%', borderRadius: 2 }} />
    </Grid>
    <Grid item xs={12} md={6} lg={5}>
      <Skeleton variant="text" height={240} />
      <Skeleton variant="text" height={40} />
      <Skeleton variant="text" height={40} />
      <Skeleton variant="text" height={40} />
    </Grid>
  </Grid>
);
DishDetails.propTypes = {
    dishId: PropType.string,
    shopId: PropType.string,
    onToggleModal: PropType.func
};

export default function DishDetails({dishId, shopId, onToggleModal}) {
  const {t} = useTranslation();
  const [value, setValue] = useState('1');
  const [product, setProduct] = useState();
  const [reviews, setReviews] = useState([]);
  const {name} = useParams();
  const {app} = useSelector(state=>state);
  const dispatch = useDispatch();
  useEffect(() => {
    handleGetDish(dishId, (data)=>setProduct(data))
    handleGetReviews(dishId, (data)=>setReviews(Object.values(data)))
  }, [setProduct, setReviews, dishId]);

  const productAndReviews = product && {
    ...product,
    reviews
  }

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  const disableConstraint = ()=>{
    dispatch(setCheckoutConstraint(false))
  };
  const procceedToAction = ()=>{
    dispatch(resetCart())
    dispatch(setCheckoutConstraint(false))
    dispatch(addCart({
      ...product,
      quantity: 1,
      subtotal: 1 * product.price,
      shop: shopId
      }))
      onToggleModal(false);
  }
  return (
      <Container maxWidth='xl'>
        <DialogAnimate open={app.isCheckoutViolation}>
          <DialogTitle>{t('dishDetails.modalTitle')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
            {t('dishDetails.modalDescription',{name})}
            </DialogContentText>
          </DialogContent>
          
          <DialogActions>
            <Button variant='outlined' color='inherit' onClick={disableConstraint}>{t('actions.no')}</Button>
            <Button variant='contained' type="submit" onClick={procceedToAction}>{t('actions.yes')}</Button>
          </DialogActions>
        </DialogAnimate>
        {product && (
          <Box sx={{ my: 3}}>
            <Card>
              <Grid container>
                <Grid item xs={12} md={6} lg={7}>
                  <ProductDetailsCarousel image={product?.image} />
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  <ProductDetailsSumary product={product} shopId={shopId} onToggleModal={onToggleModal} />
                </Grid>
              </Grid>
            </Card>

            <Grid sx={{ my: 3 }}>
                  <Card>
                    <TabContext value={value}>
                      <Box sx={{ px: 3, bgcolor: 'background.neutral' }}>
                        <TabList onChange={handleChangeTab}>
                          <Tab disableRipple value="1" label={t('forms.descriptionLabel')} />
                          <Tab
                            disableRipple
                            value="2"
                            label={t('dishDetails.reviewCount',{count: reviews.length || t('dishDetails.noReview')})}
                            sx={{ '& .MuiTab-wrapper': { whiteSpace: 'nowrap' } }}
                          />
                        </TabList>
                      </Box>

                      <Divider />

                      <TabPanel value="1">
                        <Box sx={{ p: 3 }}>
                          <Markdown children={product.description} />
                        </Box>
                      </TabPanel>
                      <TabPanel value="2">
                        <ProductDetailsReview product={productAndReviews} />
                      </TabPanel>
                    </TabContext>
                  </Card>
            </Grid>

            <Grid container sx={{ my: 8 }}>
              {PRODUCT_DESCRIPTION.map((item) => (
                <Grid item xs={12} md={4} key={item.title}>
                  <Box sx={{ my: 2, mx: 'auto', maxWidth: 280, textAlign: 'center' }}>
                    <IconWrapperStyle>
                      <Icon icon={item.icon} width={36} height={36} />
                    </IconWrapperStyle>
                    <Typography variant="subtitle1" gutterBottom>
                      {t(item.title)}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{t(item.description)}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {!product && SkeletonLoad}

        {product?.id === 'undefined' && <Typography variant="h6">{t('dishDetails.notFound')}</Typography>}
      </Container>
  );
}

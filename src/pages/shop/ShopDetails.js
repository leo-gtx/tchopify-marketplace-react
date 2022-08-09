import { useFormik } from 'formik';
import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { filter, orderBy } from 'lodash';
import close from '@iconify/icons-eva/close-fill';
import { useParams } from 'react-router-dom';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { Backdrop, Container, Typography, CircularProgress, Stack, Card, AppBar, Toolbar, IconButton, Button, Skeleton } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_MARKETPLACE } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  ShopTagFiltered,
  ShopProductSort,
  ShopProductList,
  ShopFilterSidebar,
  ShopCover,
} from '../../components/_marketplace/shop';
import { CartWidget } from '../../components/_marketplace/marketplace';
import { DialogAnimate}  from '../../components/animate';
import DishDetails from './DishDetails';
// utils
import fakeRequest from '../../utils/fakeRequest';
import { isStoreOpen, jsUcfirst } from '../../utils/utils';
// hooks
import useSettings from '../../hooks/useSettings';
// actions
import { setFiltersDishes} from '../../redux/actions/app';
import { handleGetDishesByShop } from '../../redux/actions/dishes';
import { handleGetRestaurant} from '../../redux/actions/restaurant';
import { handleGetSubcategoriesByRestaurant} from '../../redux/actions/category';


// ----------------------------------------------------------------------

function applyFilter(products, sortBy, filters) {
  // SORT BY
  if (sortBy === 'newest') {
    products = orderBy(products, ['createdAt'], ['desc']);
  }
  if (sortBy === 'priceDesc') {
    products = orderBy(products, ['price'], ['desc']);
  }
  if (sortBy === 'priceAsc') {
    products = orderBy(products, ['price'], ['asc']);
  }
  // FILTER PRODUCTS
  if (filters?.category !== 'All') {
    products = filter(products, (_product) => _product.category === filters.category);
  }
  if (filters.priceRange) {
    products = filter(products, (_product) => {
      if (filters.priceRange === 'below') {
        return _product.price < 5000;
      }
      if (filters.priceRange === 'between') {
        return _product.price >= 5000 && _product.price <= 10000;
      }
      return _product.price > 10000;
    });
  }
    if (filters?.rating) {
    products = filter(products, (_product) => {
      const convertRating = (value) => {
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1;
      };
      return _product.rating > convertRating(filters.rating);
    }); 
  }
  return products;
}

export default function ShopDetails() {
  const {t} = useTranslation();
  const { pathname, search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const { name, id } = useParams();
  const navigate = useNavigate();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [openFilter, setOpenFilter] = useState(false);
  const [dishes, setDishes] = useState();
  const [shop, setShop] = useState({});
  const [categories, setCategories] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [dishId, setDishId] = useState();
  const { sortByDish, filtersDishes, deliveryLocation} =  useSelector((state) => state.app);



  useEffect(()=>{
    handleGetRestaurant(id, (data)=> setShop(data));
    if(shop.id) handleGetDishesByShop(shop.owner, (data)=>setDishes(Object.values(data)));
    if(shop.id) handleGetSubcategoriesByRestaurant(shop.owner, (data)=> setCategories(Object.values(data)));
  },[setDishes, setShop, id, shop.id, shop.owner]);
  const filteredProducts = applyFilter(dishes, sortByDish, filtersDishes);

  const formik = useFormik({
    initialValues: {
      category: filtersDishes.category,
      priceRange: filtersDishes.priceRange,
      rating: filtersDishes.rating
    },
    onSubmit: async (values, { setSubmitting, resetForm, setValues }) => {
      try {
        await fakeRequest(500);
        resetForm();
        setValues({category: 'All', rating: '', priceRange: ''})
        setOpenFilter(false)
        setSubmitting(false);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { values, handleSubmit, isSubmitting, initialValues } = formik;

  const isDefault =
  !values.priceRange &&
  !values.rating &&
  values.category === 'All';

  useEffect(() => {
    dispatch(setFiltersDishes(values));
  }, [dispatch, values]);


  useEffect(()=>{
    
    if(queryParams.get('productId') && shop.businessHours && isStoreOpen(shop.businessHours)){
      setDishId(queryParams.get('productId'))
      setOpen(true)
    }

    if(!queryParams.get('productId')){
      setOpen(false)
    }
  },[queryParams])

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSubmit();
  };
  const handleCloseModal = () =>{
    navigate(pathname)
  };
  const handleBack= ()=>{
    navigate(PATH_MARKETPLACE.home.root)
  }

  const handleOpenModal = (dishId) =>navigate(`${pathname}?dishId=${dishId}`);
  const handleToggleModal = (value)=>{
    if(value){
      if (isOpen !== value) handleOpenModal()
    }
    if(!value){
      if (isOpen !== value) handleCloseModal()
    }
  }

  return (
    <Page title={t('titles.shopDetail')}>
      {values && (
        <Backdrop open={isSubmitting} sx={{ zIndex: 9999 }}>
          <CircularProgress />
        </Backdrop>
      )}

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={`${jsUcfirst(name)}'s Shop`}
          links={[
            { name: t('links.marketplace'), href: PATH_MARKETPLACE.home.root },
            {
              name,
            }
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative'
          }}
        >
            <ShopCover myShop={shop} deliveryLocation={deliveryLocation} />
        </Card>

        {!isDefault && (
          <Typography gutterBottom>
            <Typography component="span" variant="subtitle1">
              {filteredProducts.length}
            </Typography>
            &nbsp;{t('shopDetails.found')}
          </Typography>
        )}

        <Stack direction="row" justifyContent='space-between'  sx={{ mb: 5 }}>
          <Stack direction="row" alignItems="center" >
            <Button
                type="button"
                size="small"
                color="inherit"
                onClick={handleBack}
                startIcon={<Icon icon={arrowIosBackFill} />}
              >
                {t('actions.back')}
            </Button>
          </Stack>
          <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end">
            <ShopTagFiltered
              filters={filtersDishes}
              formik={formik}
              isShowReset={openFilter}
              onResetFilter={handleResetFilter}
              isDefault={isDefault}
            />

            <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
              <ShopFilterSidebar
                formik={formik}
                isOpenFilter={openFilter}
                onResetFilter={handleResetFilter}
                onOpenFilter={handleOpenFilter}
                onCloseFilter={handleCloseFilter}
                categories={categories}
              />
              <ShopProductSort />
            </Stack>
          </Stack>
        </Stack>

        <ShopProductList products={filteredProducts || []} isLoad={!dishes} handleSelectProduct={handleOpenModal} isClosed={shop.businessHours && !isStoreOpen(shop.businessHours)} />
        <DialogAnimate open={isOpen} onClose={handleCloseModal} fullScreen>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
          <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseModal}
              aria-label="close"
            >
              <Icon icon={close} width={25} height={25} />
            </IconButton>
            {
              dishes && dishId?
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {dishes.find((item)=> item.id === dishId).name}
              </Typography>:
               <Skeleton variant='text' width={200} />
            }
          </Toolbar>
        </AppBar>
          <DishDetails dishId={dishId} shopId={id} onToggleModal={handleToggleModal} />
        </DialogAnimate>
        <CartWidget/>
      </Container>
    </Page>
  );
}

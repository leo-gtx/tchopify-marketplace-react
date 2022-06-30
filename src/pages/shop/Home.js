import { useEffect, useState } from 'react';
import { orderBy } from 'lodash';
import { useTranslation } from 'react-i18next';
// material
import { Container, Stack } from '@material-ui/core';
// redux
import { useSelector } from 'react-redux';

// routes
import { PATH_MARKETPLACE } from '../../routes/paths';

// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  ShopProductSort,
  ShopProductList,
  CartWidget,
} from '../../components/_marketplace/marketplace';

// actions
import { handleGetStores } from '../../redux/actions/restaurant';

// ----------------------------------------------------------------------

function applySort(stores, sortBy) {
  // SORT BY
  if (sortBy === 'oldest') {
    stores = orderBy(stores, ['created'], ['asc']);
  }
  if (sortBy === 'newest') {
    stores = orderBy(stores, ['createdAt'], ['desc']);
  }
 
  return stores;
}

export default function Home() {
  const { themeStretch } = useSettings();
  const {t} = useTranslation();
  const [stores, setStores] = useState();
  const {app} = useSelector((state)=>state)
  const {sortByStore, deliveryLocation } = app;
  
  useEffect(()=>{
    handleGetStores({status: 'activated'}, (data)=>{
      setStores(applySort(Object.values(data).filter((item)=>item.location.includes(deliveryLocation.split(',')[0])), sortByStore))
    })
  },[setStores, deliveryLocation, sortByStore])

  return (
    <Page title="MarketPlace | Tchopify">

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('home.title')}
          links={[
            { name: t('links.home'), href: PATH_MARKETPLACE.home.root },
          ]}
        />
        <CartWidget/>
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <ShopProductSort/>
        </Stack>
        
        <ShopProductList products={stores || []} isLoad={!stores} />
        
      </Container>
    </Page>
  );
}

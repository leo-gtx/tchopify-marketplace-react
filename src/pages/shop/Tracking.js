import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
// material
import {
  Box,
  Grid,
  Container,
  Skeleton,
} from '@material-ui/core';
// routes
import { PATH_MARKETPLACE } from '../../routes/paths';

// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';

import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { InvoiceToolbar } from '../../components/_marketplace/shop/invoice';
import { OrderTimeline, MapRoute} from '../../components/_marketplace/order/traking';
// action
import { GetOrder } from '../../redux/actions/order';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function Tracking() {
  const { themeStretch } = useSettings();
  // const navigate = useNavigate();
  const {t} = useTranslation();
  const { id } = useParams();
  const [order, setOrder] = useState();

  useEffect(()=>{
    GetOrder(id, (data)=>setOrder(data))
  },[setOrder, id]);

  /* const handleBack = ()=>{
    navigate(PATH_MARKETPLACE.home.orders)
 } */

  if(!order){
    return (
      <>
        <Grid container>
              <Grid item xs={12}>
                <Box sx={{ margin: 1 }}>
                <Skeleton  variant="rectangular" height={300} sx={{ borderRadius: 2 }}/>
                </Box>
              </Grid>
            <Grid item xs={12}>
              <Box sx={{ margin: 1 }}>
              <Skeleton  variant="rectangular" height={300} sx={{ borderRadius: 2 }}/>
              </Box>
            </Grid>
          </Grid>
      </>
    )
  }

  const {billing, from, mode } = order;

  return (
    <Page title={t('titles.orderTracking')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
          heading={t('invoice.title')}
          links={[
            { name: t('links.marketplace'), href: PATH_MARKETPLACE.home.root },
            {
              name: t('links.orders'),
              href: PATH_MARKETPLACE.home.orders
            },
            { name: t('links.tracking') }
          ]}
        />
           <InvoiceToolbar invoice={order} />
           <Grid container>
              <Grid item xs={12}>
                <Box sx={{ margin: 1 }}>
                  <OrderTimeline order={order}/>
                </Box>
              </Grid>
            {
              ['DELIVERY','TAKEAWAY'].includes(mode) && (
                <Grid item xs={12} >
                  <Box sx={{ margin: 1 }}>
                    <MapRoute travelMode="DRIVING" origin={from.location} destination={billing.fullAddress} />
                  </Box>
                </Grid>
              )
            }
              
          </Grid>
      </Container>
    </Page>
  );
}

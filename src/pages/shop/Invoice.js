import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
// material
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Grid,
  Card,
  Table,
  Divider,
  TableRow,
  Container,
  TableBody,
  TableHead,
  Stack,
  TableCell,
  Typography,
  TableContainer,
  Skeleton
} from '@material-ui/core';
// routes
import { PATH_MARKETPLACE } from '../../routes/paths';
// utils
import { fCurrency } from '../../utils/formatNumber';
import { fDate } from '../../utils/formatTime';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { InvoiceToolbar } from '../../components/_marketplace/shop/invoice';
// action
import { GetOrder } from '../../redux/actions/order';

// ----------------------------------------------------------------------


const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  }
}));

// ----------------------------------------------------------------------

export default function Invoice() {
  const {t} = useTranslation();
  const { themeStretch } = useSettings();
  const { id } = useParams();
  const [order, setOrder] = useState();
  useEffect(()=>{
    GetOrder(id, (data)=>setOrder(data))
  },[setOrder, id]);
  if(!order){
    return (
      <>
         <Stack>
            <Stack sx={{ my: 5}}>
              <Skeleton variant='text' width={200}/>
              <Skeleton variant='text' width={400}/>
            </Stack>
              
              <Skeleton  variant="rectangular" height={800} sx={{ borderRadius: 2 }}/>
          </Stack>
        
      </>
    )
  }

  const {subtotal, total, discount, status, billing, from, cart, shipping, paymentStatus, orderAt } = order;
  let statusColor='';
  if(status === 'new' || status === 'ready' || status === 'shipping' || status === 'accepted'){
      statusColor = 'warning'
  }else if(status === 'cancelled' || status === 'rejected' || status === 'lost'){
      statusColor = 'error'
  }else{
    statusColor = 'success'
  }
  return (
    <Page title="Marketplace: Order Details | Tchopify">
      <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
          heading={t('invoice.title')}
          links={[
            { name: t('links.marketplace'), href: PATH_MARKETPLACE.home.root },
            {
              name: t('links.orders'),
              href: PATH_MARKETPLACE.home.orders
            },
            { name: t('links.details') }
          ]}
        />
        <InvoiceToolbar invoice={order} />
        
        <Card sx={{ pt: 5, px: 5, marginTop: 5 }}>
          <Grid container>
            <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
              <Box component="img" alt="logo" src="/static/brand/logo_full.png" sx={{ height: 30, width: 'auto' }} />
            </Grid>

            <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
              <Box sx={{ textAlign: { sm: 'right' } }}>
                <Label color={statusColor} sx={{ textTransform: 'uppercase', mb: 1 }}>
                  {status}
                </Label>
                <Typography variant="h6">INV-{id}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                {t('invoice.from')}
              </Typography>
              <Typography variant="body2">{from.name}</Typography>
              <Typography variant="body2">{from.locationDescription}</Typography>
              <Typography variant="body2">{t('invoice.phone')}: {from.phoneNumber}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              {t('invoice.to')}
              </Typography>
              <Typography variant="body2">{billing.receiver}</Typography>
              <Typography variant="body2">{billing.fullAddress}</Typography>
              <Typography variant="body2">{t('invoice.phone')}: {billing.phone}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              {t('invoice.orderAt')}
              </Typography>
              <Typography variant="body2">{fDate(orderAt)}</Typography>
            </Grid>

            
          </Grid>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 960 }}>
              <Table>
                <TableHead
                  sx={{
                    borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    '& th': { backgroundColor: 'transparent' }
                  }}
                >
                  <TableRow>
                    <TableCell width={40}>#</TableCell>
                    <TableCell align="left">Description</TableCell>
                    <TableCell align="left">Qty</TableCell>
                    <TableCell align="right">Unit price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {cart.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        borderBottom: (theme) => `solid 1px ${theme.palette.divider}`
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell align="left">
                        <Box sx={{ maxWidth: 560 }}>
                          <Typography variant="subtitle2">{row.name}</Typography>
                          { row.options.length > 0 && row.options.map((item, index)=>(
                            <Typography key={index} variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                              {item}
                            </Typography>
                          ))}
                          
                        </Box>
                      </TableCell>
                      <TableCell align="left">{row.quantity}</TableCell>
                      <TableCell align="right">{fCurrency(row.price)}</TableCell>
                      <TableCell align="right">{fCurrency(row.price * row.quantity)}</TableCell>
                    </TableRow>
                  ))}

                  <RowResultStyle>
                    <TableCell colSpan={3} />
                    <TableCell align="right">
                      <Box sx={{ mt: 2 }} />
                      <Typography variant="body1">{t('invoice.subtotal')}</Typography>
                    </TableCell>
                    <TableCell align="right" width={120}>
                      <Box sx={{ mt: 2 }} />
                      <Typography variant="body1">{fCurrency(subtotal)}</Typography>
                    </TableCell>
                  </RowResultStyle>
                  <RowResultStyle>
                    <TableCell colSpan={3} />
                    <TableCell align="right">
                      <Typography variant="body1">{t('invoice.discount')}</Typography>
                    </TableCell>
                    <TableCell align="right" width={120}>
                      <Typography sx={{ color: 'error.main' }}>{fCurrency(-discount)}</Typography>
                    </TableCell>
                  </RowResultStyle>
                  <RowResultStyle>
                    <TableCell colSpan={3} />
                    <TableCell align="right">
                      <Typography variant="body1">{t('invoice.shipping')}</Typography>
                    </TableCell>
                    <TableCell align="right" width={120}>
                      <Typography variant="body1">{fCurrency(shipping)}</Typography>
                    </TableCell>
                  </RowResultStyle>
                  <RowResultStyle>
                    <TableCell colSpan={3} />
                    <TableCell align="right">
                      <Typography variant="h6">{t('invoice.total')}</Typography>
                    </TableCell>
                    <TableCell align="right" width={140}>
                      <Typography variant="h6">{fCurrency(total)}</Typography>
                    </TableCell>
                  </RowResultStyle>
                  <RowResultStyle>
                    <TableCell colSpan={4} />
                    <TableCell  align="center" width={140}>
                      <Typography variant="h6" sx={{color: 'error.main'}}>{paymentStatus.toUpperCase()}</Typography>
                    </TableCell>
                  </RowResultStyle>
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Divider sx={{ mt: 5 }} />

          <Grid container>
            <Grid item xs={12} md={9} sx={{ py: 3 }}>
              <Typography variant="subtitle2">NOTES</Typography>
              <Typography variant="body2">
              {t('invoice.note')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
              <Typography variant="subtitle2">{t('invoice.contactLabel')}</Typography>
              <Typography variant="body2">support@tchopify.com</Typography>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Page>
  );
}

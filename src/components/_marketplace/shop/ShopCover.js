import PropTypes from 'prop-types';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import eyeOff from '@iconify/icons-eva/eye-off-2-fill';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Box, Typography, Rating, Stack, Skeleton } from '@material-ui/core';
// utils
import { shippingCost, isStoreOpen, getNextOpenDay } from '../../../utils/utils';
import { fCurrency } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  '&:before': {
    top: 0,
    zIndex: 9,
    width: '100%',
    content: "''",
    height: '100%',
    position: 'absolute',
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)', // Fix on Mobile
    backgroundColor: alpha(theme.palette.primary.darker, 0.50)
  }
}));

const InfoStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(3)
  }
}));

const CoverImgStyle = styled('img')({
  zIndex: 8,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

ShopCover.propTypes = {
  myShop: PropTypes.object,
  deliveryLocation: PropTypes.string,
};

export default function ShopCover({ myShop, deliveryLocation }) {
  const { t } = useTranslation();
  const { image, name, businessHours, rating, location, kmCost, mode} = myShop;
  const [distance, setDistance] = useState();
  const [duration, setDuration] = useState();
  
  
  const distanceMatrixCallback = useCallback((result, status) => {
    if (status === "OK" ) {
      setDistance(result.rows[0].elements[0].distance)
      setDuration(result.rows[0].elements[0].duration)
    }
  },[]);

  useEffect(()=>{
    if(location && deliveryLocation && window.google?.maps){
      const {maps} = window.google;
      const service = new maps.DistanceMatrixService();
      service.getDistanceMatrix({
      origins: [location],
      destinations: [deliveryLocation],
      travelMode: 'DRIVING'
      }, distanceMatrixCallback)
    }
   
  },[location, deliveryLocation, distanceMatrixCallback])


  return (
    <RootStyle>
      <InfoStyle>
        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: 'common.white',
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          {businessHours && !isStoreOpen(businessHours) ? (
             <Stack justifyContent='center' alignItems='center'>
               <Stack direction='row' justifyContent='center' alignItems='center'>
                 <Icon icon={eyeOff} height={40} width={40}/>
                  <Typography variant='h4'>{`${name} (${t('common.closed').toUpperCase()})`}</Typography>
               </Stack>
               {rating && rating > 0 && <Rating size='small' value={rating || 0} emptyIcon={<Icon/>} readOnly/>}
               <Typography>{t(getNextOpenDay(businessHours).t, { day: getNextOpenDay(businessHours).day})}</Typography>
             </Stack>
            
          ):(
            <>
              <Typography variant="h4">{name}</Typography>
              {rating && rating > 0 && <Rating size='small' value={rating || 0} emptyIcon={<Icon/>} readOnly/>}
              <Stack direction='row' justifyContent='center'>
                <Stack direction='row'  alignItems='center'>
                  { mode?.includes('DELIVERY') && (
                    <>
                      <Icon icon='ic:baseline-delivery-dining' width={24} height={24} opacity={0.72} />
                      { !duration || !distance ?
                        <Skeleton variant='text' width={200} />
                        :
                        <Typography sx={{ opacity: 0.72 }}>{`${duration?.text} • ${fCurrency(shippingCost(distance?.value, kmCost))} ${mode?.includes('TAKEAWAY') && ' • '}`}</Typography>
                      }
                    </>
                    )
                  }
                  {
                    mode?.includes('TAKEAWAY') && (
                      <>
                      <Icon icon='ic:sharp-takeout-dining' width={24} height={24} opacity={0.72} />
                        <Typography sx={{ opacity: 0.72 }}>{t('checkout.takeawayTitle')}</Typography>
                      </>
                    )
                  }
                </Stack>
              </Stack>
            </>
          )}
          
          
        </Box>
      </InfoStyle>
      <CoverImgStyle alt="profile cover" src={image || '/static/illustrations/illustration_no_store_image.jpg'} />
    </RootStyle>
  );
}

import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
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
  const { image, name, businessHours, rating, location, kmCost} = myShop;
  const [distance, setDistance] = useState();
  const [duration, setDuration] = useState();

  const service = new window.google.maps.DistanceMatrixService();
  const distanceMatrixCallback = useCallback((result, status) => {
    if (status === "OK" ) {
      setDistance(result.rows[0].elements[0].distance)
      setDuration(result.rows[0].elements[0].duration)
    }
  },[setDuration, setDistance]);

  useEffect(()=>{
    if(location && deliveryLocation){
       service.getDistanceMatrix({
      origins: [location],
      destinations: [deliveryLocation],
      travelMode: 'DRIVING'
      }, distanceMatrixCallback)
    }
   
  },[location, deliveryLocation])

  

  if(!image){
    return <Skeleton variant='rectangular' height='100%' />
  }

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
               <Rating size='small' value={rating || 0} readOnly/>
               <Typography>{t(getNextOpenDay(businessHours).t, { day: getNextOpenDay(businessHours).day})}</Typography>
             </Stack>
            
          ):(
            <>
              <Typography variant="h4">{name}</Typography>
              <Rating size='small' value={rating || 0}  readOnly/>
              <Stack direction='row' justifyContent='center'>
                <Stack direction='row'  alignItems='center'>
                  <Icon icon='ic:baseline-delivery-dining' width={24} height={24} opacity={0.72} />
                  { !duration || !distance ?
                    <Skeleton variant='text' width={200} />
                    :
                    <Typography sx={{ opacity: 0.72 }}>{`${duration?.text} • ${fCurrency(shippingCost(distance?.value, kmCost))}`}</Typography>
                  }
                  
                </Stack>
              </Stack>
            </>
          )}
          
          
        </Box>
      </InfoStyle>
      <CoverImgStyle alt="profile cover" src={image} />
    </RootStyle>
  );
}

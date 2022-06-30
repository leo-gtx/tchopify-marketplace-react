import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// material
import { styled } from '@material-ui/core/styles';
import { Box,  Container, Typography } from '@material-ui/core';

// components
import Page from '../../components/Page';
import { PhoneNumberForm } from '../../components/authentication/phone-verification';
import VerifyCode from './VerifyCode';
// routes
import { PATH_MARKETPLACE } from '../../routes/paths';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function PhoneVerification() {
  const {t}= useTranslation();
  const { isAuthenticated } = useSelector((state)=>state.authedUser);
  const [phone, setPhone] = useState('');
  const [confirmationID, setConfirmation] = useState();
  const { pathname } = useLocation();
  if(isAuthenticated && pathname.includes('phone-verification')){
    return <Navigate to={PATH_MARKETPLACE.home.root} />
  }

  if(phone){
    return <VerifyCode resetPhoneNumber={()=> setPhone('')} confirmation={confirmationID}/>
  }

  return (
    <RootStyle title="Phone number verification | Tchopify">

      <Container>
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            <>
              <Typography variant="h3" paragraph>
                {t('phoneVerification.title')}
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                {t('phoneVerification.subtitle')}
              </Typography>

              <PhoneNumberForm  onGetPhoneNumber={(value) => setPhone(value)} onGetConfirmation={(value)=> setConfirmation(value)} />
            </>
        </Box>
      </Container>
      
    </RootStyle>
  );
}

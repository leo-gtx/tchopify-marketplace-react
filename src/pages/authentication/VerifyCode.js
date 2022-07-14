import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Button, Link, Container, Typography } from '@material-ui/core';
// components
import Page from '../../components/Page';
import { VerifyCodeForm } from '../../components/authentication/verify-code';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  padding: theme.spacing(12, 0)
}));

VerifyCode.propTypes= {
  resetPhoneNumber: PropTypes.func,
  confirmation: PropTypes.object,
};
// ----------------------------------------------------------------------

export default function VerifyCode({ resetPhoneNumber, confirmation }) {
  const {t} = useTranslation();
  return (
    <RootStyle title="Code OTP | Tchopify">

      <Container>
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
          <Button
            size="small"
            startIcon={<Icon icon={arrowIosBackFill} width={20} height={20} />}
            sx={{ mb: 3 }}
            onClick={resetPhoneNumber}
          >
            {t('actions.back')}
          </Button>

          <Typography variant="h3" paragraph>
            {t('verifyCode.title')}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            {t('verifyCode.subtitle')}
          </Typography>

          <Box sx={{ mt: 5, mb: 3 }}>
            <VerifyCodeForm onConfirmation={confirmation} />
          </Box>

          <Typography variant="body2" align="center">
            {t('verifyCode.noCode')} &nbsp;
            <Link variant="subtitle2" underline="none" onClick={() => {}}>
              {t('verifyCode.resendCode')}
            </Link>
          </Typography>
        </Box>
      </Container>
    </RootStyle>
  );
}

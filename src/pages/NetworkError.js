import { useTranslation } from 'react-i18next';
import { styled } from '@material-ui/core/styles';
// material
import { Box, Typography, Container } from '@material-ui/core';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function NetworkError() {
  const {t} = useTranslation();
  return (
    <RootStyle title="No Internet Connection | Tchopify">
      <Container>
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
          <Typography variant="h3" paragraph>
            {t('networkError.title')}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>{t('networkError.subtitle')}</Typography>
        </Box>
      </Container>
    </RootStyle>
  );
}

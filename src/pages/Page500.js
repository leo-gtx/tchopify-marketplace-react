import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { styled } from '@material-ui/core/styles';
// material
import { Box, Button, Typography, Container } from '@material-ui/core';
// components
import Page from '../components/Page';
import { SeverErrorIllustration } from '../assets';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function Page500() {
  const {t} = useTranslation();
  return (
    <RootStyle title="500 Internal Server Error | Tchopify">
      <Container>
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
          <Typography variant="h3" paragraph>
            {t('page500.title')}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>{t('page500.subtitle')}</Typography>

          <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />

          <Button to="/" size="large" variant="contained" component={RouterLink}>
            {t('actions.goHome')}
          </Button>
        </Box>
      </Container>
    </RootStyle>
  );
}

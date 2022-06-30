import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Button, Typography, Container } from '@material-ui/core';
// components
import { MotionContainer, varBounceIn } from '../components/animate';
import Page from '../components/Page';
import { PageNotFoundIllustration } from '../assets';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function Page404() {
  const {t} = useTranslation();
  return (
    <RootStyle title="404 Page Not Found | Tchopify">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                {t('page404.title')}
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
            {t('page404.subtitle')}
            </Typography>

            <motion.div variants={varBounceIn}>
              <PageNotFoundIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
            </motion.div>

            <Button to="/" size="large" variant="contained" component={RouterLink}>
              {t('actions.goHome')}
            </Button>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}

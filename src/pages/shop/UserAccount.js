import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
import carFill from '@iconify/icons-eva/car-fill';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { Container, Tab, Box, Tabs, Stack, Button } from '@material-ui/core';
// routes
import { PATH_MARKETPLACE } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  AccountGeneral,
  AccountOrderHistory
} from '../../components/_marketplace/user/account';

// ----------------------------------------------------------------------

export default function UserAccount() {
  const { themeStretch } = useSettings();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [currentTab, setCurrentTab] = useState('');
  const navigate = useNavigate();
  const { t }  = useTranslation();
  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <AccountGeneral />
    },
    {
      value: 'orders',
      icon: <Icon icon={carFill} width={20} height={20} />,
      component: <AccountOrderHistory/>
    }
  ];

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleBack = ()=>{
    navigate(PATH_MARKETPLACE.home.root)
  }

  useEffect(()=>{
    if(queryParams.get('tabName')){
      setCurrentTab(queryParams.get('tabName'))
    }
  },[queryParams.get('tabName')])

  return (
    <Page title={t('titles.account')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Account"
          links={[
            { name: t('links.marketplace'), href: PATH_MARKETPLACE.home.root },
            { name: t('links.profile') }
          ]}
        />
         <Stack mb={5} direction="row" justifyContent="flex-start" spacing={1.5}>
            <Button
                type="button"
                size="small"
                color="inherit"
                onClick={handleBack}
                startIcon={<Icon icon={arrowIosBackFill} />}
            >
                {t('actions.back')}
            </Button>
          </Stack>
        <Stack spacing={5}>
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={handleChangeTab}
          >
            {ACCOUNT_TABS.map((tab) => (
              <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>

          {ACCOUNT_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Stack>
      </Container>
    </Page>
  );
}

import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Link, Button, Divider, Typography, Stack } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { resetCart } from '../../../../redux/actions/app';
// routes
import { PATH_MARKETPLACE } from '../../../../routes/paths';
//
import { DialogAnimate } from '../../../animate';
import { OrderCompleteIllustration } from '../../../../assets';

// ----------------------------------------------------------------------

const DialogStyle = styled(DialogAnimate)(({ theme }) => ({
  '& .MuiDialog-paper': {
    margin: 0,
    [theme.breakpoints.up('md')]: {
      maxWidth: 'calc(100% - 48px)',
      maxHeight: 'calc(100% - 48px)'
    }
  }
}));

// ----------------------------------------------------------------------

export default function CheckoutOrderComplete({ ...other }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {authedUser} = useSelector((state)=>state);
  const orders = Object.values(authedUser.orders);
  const lastOrder = orders[orders.length - 1];

  const handleResetStep = () => {
    dispatch(resetCart());
    navigate(PATH_MARKETPLACE.home.root);
  };

  return (
    <DialogStyle fullScreen {...other}>
      <Box sx={{ p: 4, maxWidth: 480, margin: 'auto' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" paragraph>
            Thank you for your purchase!
          </Typography>

          <OrderCompleteIllustration sx={{ height: 260, my: 10 }} />

          <Typography align="left" paragraph>
            Thanks for placing order &nbsp;
            <Link href={`${process.env.REACT_APP_HOST}${PATH_MARKETPLACE.home.root}orders/${lastOrder.id}/details`}>#{lastOrder.id}</Link>
          </Typography>

          <Typography align="left">
            We will send you a notification when it delivers.
            <br /> <br /> If you have any question or queries then fell to get in contact us. <br /> <br /> All the
            best,
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Stack direction={{ xs: 'column-reverse', sm: 'row' }} justifyContent="space-between" spacing={2}>
          <Button color="inherit" onClick={handleResetStep} startIcon={<Icon icon={arrowIosBackFill} />}>
            Continue Shopping
          </Button>
        </Stack>
      </Box>
    </DialogStyle>
  );
}

import PropTypes from 'prop-types';
import { 
    Card, 
    CardHeader, 
    CardContent,
    Typography,
 } from '@material-ui/core';
 import { styled } from '@material-ui/core/styles';
// hooks
import useCountdown from '../../../../hooks/useCountdown';

Countdown.propTypes = {
    deliveryTime: PropTypes.number,
    cookingTime: PropTypes.number,
    orderAt: PropTypes.number,
};

const CountdownStyle = styled('div')({
    display: 'flex',
    justifyContent: 'center'
});
const SeparatorStyle = styled(Typography)(({ theme }) => ({
    margin: theme.spacing(0, 1),
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing(0, 2.5)
    }
}));

export default function Countdown({deliveryTime, cookingTime, orderAt}){
    const deliveryDate = new Date(orderAt);
    deliveryDate.setMinutes(deliveryDate.getMinutes() + deliveryTime + cookingTime);
    const countdown = useCountdown(deliveryDate);
    const expired = (deliveryDate - new Date()) < 0; 
    // const cancel = expired && (new Date(deliveryDate - new Date()).getMinutes() > 20);
    return (
        <Card>
            <CardHeader title="Countdown"/>
            <CardContent>
                <CountdownStyle>
                    <div>
                    <Typography variant="h2" color={expired ? 'primary': 'initial'}>{ expired ? '00' : countdown.hours}</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Hours</Typography>
                    </div>

                    <SeparatorStyle variant="h2" color={expired ? 'primary': 'initial'}>:</SeparatorStyle>

                    <div>
                    <Typography variant="h2" color={expired ? 'primary': 'initial'}>{ expired ? '00' : countdown.minutes}</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Minutes</Typography>
                    </div>

                    <SeparatorStyle variant="h2" color={expired ? 'primary': 'initial'}>:</SeparatorStyle>

                    <div>
                    <Typography variant="h2" color={expired ? 'primary': 'initial'}>{ expired? '00' : countdown.seconds}</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Seconds</Typography>
                    </div>
            </CountdownStyle>
            </CardContent>
        </Card>
    )
}
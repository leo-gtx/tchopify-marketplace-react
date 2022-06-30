import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// material
import { Card, Typography, CardHeader, CardContent } from '@material-ui/core';
import {
  Timeline,
  TimelineDot,
  TimelineItem,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator
} from '@material-ui/lab';
// utils
import { fToNow } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------


const ORDER_HIERARCHIES = {
  new: [
    {
      id: 1,
      title: 'Order placed',
      type: 'order4',
      time: 'orderAt'
    }
  ],
  rejected: [
    {
      id: 1,
      title: 'Order placed',
      type: 'order4',
      time: 'orderAt'
    },
    {
      id: 2,
      title: 'Order rejected',
      type: 'order1',
      time: 'rejectedDate'
    }
  ],
  accepted: [
    {
      id: 1,
      title: 'Order placed',
      type: 'order4',
      time: 'orderAt'
    },
    {
      id: 2,
      title: 'Order accepted',
      type: 'order3',
      time: 'acceptedDate'
    }
  ],
  ready: [
    {
      id: 1,
      title: 'Order placed',
      type: 'order4',
      time: 'orderAt'
    },
    {
      id: 2,
      title: 'Order accepted',
      type: 'order3',
      time: 'acceptedDate'
    },
    {
      id: 3,
      title: 'Order ready',
      type: 'order4',
      time: 'readyDate'
    }
  ],
  shipping: [
    {
      id: 1,
      title: 'Order placed',
      type: 'order4',
      time: 'orderAt'
    },
    {
      id: 2,
      title: 'Order accepted',
      type: 'order3',
      time: 'acceptedDate'
    },
    {
      id: 3,
      title: 'Order ready',
      type: 'order4',
      time: 'readyDate'
    },
    {
      id: 4,
      title: 'Order on the way',
      type: 'order3',
      time: 'shippingDate'
    }
  ],
  completed: [
    {
      id: 1,
      title: 'Order placed',
      type: 'order4',
      time: 'orderAt'
    },
    {
      id: 2,
      title: 'Order accepted',
      type: 'order3',
      time: 'acceptedDate'
    },
    {
      id: 3,
      title: 'Order ready',
      type: 'order4',
      time: 'readyDate'
    },
    {
      id: 4,
      title: 'Order on the way',
      type: 'order3',
      time: 'shippingDate'
    },
    {
      id: 5,
      title: 'Order delivered',
      type: 'order2',
      time: 'completedDate'
    }
  ]

}


// ----------------------------------------------------------------------

OrderItem.propTypes = {
  item: PropTypes.object,
  isLast: PropTypes.bool,
  order: PropTypes.object
};

function OrderItem({ item, isLast, order }) {
  const { type, title, time } = item;
  console.log(order[time])
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={
            (type === 'order1' && 'primary') ||
            (type === 'order2' && 'success') ||
            (type === 'order3' && 'info') ||
            (type === 'order4' && 'warning') ||
            'error'
          }
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fToNow(order[time])}
          </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

export default function AnalyticsOrderTimeline({order}) {
  const {status} = order;
  const {t} = useTranslation();
  return (
    <Card
      sx={{
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none'
        }
      }}
    >
      <CardHeader title={t('tracking.timelineTitle')} />
      <CardContent>
        <Timeline>
          {ORDER_HIERARCHIES[status].map((item, index) => (
            <OrderItem key={item.title} order={order} item={item} isLast={index === ORDER_HIERARCHIES[status].length - 1} />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}

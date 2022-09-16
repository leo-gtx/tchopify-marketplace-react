import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
// material
import { useTheme } from '@material-ui/core/styles';
import { Card, CardHeader } from '@material-ui/core';
//
import { CarouselControlsArrowsBasic1 } from '../../../carousel';
import OrderItem from './OrderItem';
import EmptyContent from '../../../EmptyContent';

// ----------------------------------------------------------------------


OrderCaroussel.propTypes = {
    title: PropTypes.string,
    data: PropTypes.array,
    action1: PropTypes.shape({
      title: PropTypes.string,
      visible: PropTypes.bool,
      onAction: PropTypes.func
    }),
    action2: PropTypes.shape({
      title: PropTypes.string,
      visible: PropTypes.bool,
      onAction: PropTypes.func
    }),
  };

export default function OrderCaroussel({ title, data, action1, action2 }) {
  const theme = useTheme();
  const carouselRef = useRef(null);
  const {t} = useTranslation();
  const settings = {
    dots: false,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),


  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  const isEmpty = data.length <= 0;
  return (
    <Card>
      <CardHeader
        title={title}
        subheader={`${data.length} Orders`}
        action={
          <CarouselControlsArrowsBasic1
            arrowLine
            onNext={handleNext}
            onPrevious={handlePrevious}
            sx={{
              position: 'static',
              '& button': { color: 'text.primary' }
            }}
          />
        }
        sx={{
          '& .MuiCardHeader-action': {
            alignSelf: 'center',
          }
        }}
      />

      <Slider ref={carouselRef} {...settings}>
        { !isEmpty?
        data.map((item, index) => (
          <OrderItem key={item.id} item={item} position={index + 1} action1={action1} action2={action2} />
        )):
          (
            <EmptyContent title={t('allOrders.noOrder')} />
          )
      }
      </Slider>
    </Card>
  );
}

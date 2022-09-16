import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
// material
import { Divider, Collapse } from '@material-ui/core';
//
import ProductDetailsReviewForm from './ProductDetailsReviewForm';
import ProductDetailsReviewList from './ProductDetailsReviewList';
import ProductDetailsReviewOverview from './ProductDetailsReviewOverview';
// utils
import { isPurchased } from '../../../../utils/utils';
// ----------------------------------------------------------------------

ProductDetailsReview.propTypes = {
  product: PropTypes.object
};

export default function ProductDetailsReview({ product }) {
  const {isAuthenticated, orders} = useSelector((state)=>state.authedUser);
  const [reviewBox, setReviewBox] = useState(false);

  const handleOpenReviewBox = () => {
    setReviewBox((prev) => !prev);
  };

  const handleCloseReviewBox = () => {
    setReviewBox(false);
  };

  const purchased = isPurchased(Object.values(orders), product.id);

  return (
    <>
      { isAuthenticated && purchased && (
        <>
        <ProductDetailsReviewOverview product={product} onOpen={handleOpenReviewBox} />

        <Divider />
  
        <Collapse in={reviewBox}>
          <ProductDetailsReviewForm product={product} onClose={handleCloseReviewBox} id="move_add_review" />
          <Divider />
        </Collapse>
        </>
      )}

      <ProductDetailsReviewList product={product} />
    </>
  );
}

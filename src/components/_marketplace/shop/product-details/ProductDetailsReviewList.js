import PropTypes from 'prop-types';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import roundVerified from '@iconify/icons-ic/round-verified';
// material
import { Box, List, Rating, Avatar, ListItem, Pagination, Typography } from '@material-ui/core';
// utils
import { fDate, fToNow } from '../../../../utils/formatTime';


// ----------------------------------------------------------------------

ReviewItem.propTypes = {
  review: PropTypes.object
};

function ReviewItem({ review }) {
  const { name, rating, comment, postedAt, avatarUrl, isPurchased } = review;

  return (
    <>
      <ListItem
        disableGutters
        sx={{
          mb: 5,
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', sm: 'row' }
        }}
      >
        <Box
          sx={{
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            mb: { xs: 2, sm: 0 },
            minWidth: { xs: 160, md: 240 },
            textAlign: { sm: 'center' },
            flexDirection: { sm: 'column' }
          }}
        >
          <Avatar
            src={avatarUrl}
            sx={{
              mr: { xs: 2, sm: 0 },
              mb: { sm: 2 },
              width: { md: 64 },
              height: { md: 64 }
            }}
          />
          <div>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {fToNow(postedAt)}
            </Typography>
          </div>
        </Box>

        <div>
          <Rating size="small" value={rating} precision={0.1} readOnly />

          {isPurchased && (
            <Typography variant="caption" sx={{ my: 1, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
              <Icon icon={roundVerified} width={16} height={16} />
              &nbsp;Verified purchase
            </Typography>
          )}

          <Typography variant="body2">{comment}</Typography>
        </div>
      </ListItem>
    </>
  );
}

ProductDetailsReviewList.propTypes = {
  product: PropTypes.object
};

export default function ProductDetailsReviewList({ product }) {
  const { reviews } = product;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(reviews.length / 10);
  return (
    <Box sx={{ pt: 3, px: 2, pb: 5 }}>
      <List disablePadding>
        {reviews.slice(page * 10, (page + 1) * 10).map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </List>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination count={totalPages} defaultValue={page + 1} color="primary" onChange={(e, value)=>setPage(value - 1)} />
      </Box>
    </Box>
  );
}

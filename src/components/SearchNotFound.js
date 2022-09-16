import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// material
import { Paper, Typography } from '@material-ui/core';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  const {t} = useTranslation();
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        {t('table.notFound')}
      </Typography>
      <Typography variant="body2" align="center">
        {t('table.notFound1')} &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. {t('table.notFound1')}
      </Typography>
    </Paper>
  );
}

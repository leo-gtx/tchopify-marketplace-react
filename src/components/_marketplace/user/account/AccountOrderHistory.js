import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Table,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { handleGetOrders } from '../../../../redux/actions/order';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// hooks
import useSettings from '../../../../hooks/useSettings';
// components
import Label from '../../../Label';
import Scrollbar from '../../../Scrollbar';
import SearchNotFound from '../../../SearchNotFound';
import {
    OrderListHead,
    OrderListToolbar,
    OrderMoreMenu
} from '../../shop/order-list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'from', label: 'table.store', alignRight: false },
  { id: 'total', label: 'table.amount', alignRight: false },
  { id: 'orderAt', label: 'table.orderAt', alignRight: false },
  { id: 'status', label: 'table.status', alignRight: false },
  { id: '' }
];

const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadiusSm
}));

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  if (query) {
    return filter(array, (_orders) => (_orders.id.toLowerCase().indexOf(query.toLowerCase()) !== -1) || _orders.from.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------

export default function AccountOrderHistory() {
  const { themeStretch } = useSettings();
  const {t} = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const userId =  useSelector((state)=>state.authedUser.id)
  
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [filterId, setFilterId] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('orderAt');

  useEffect(() => {
     dispatch(handleGetOrders(userId));
  }, [dispatch, userId]);
  const orders  = useSelector((state) => Object.values(state.authedUser.orders));
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orders.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterById = (event) => {
    setFilterId(event.target.value);
  };


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

  const filteredOrders = applySortFilter(orders, getComparator(order, orderBy), filterId);

  const isOrdersNotFound = filteredOrders.length === 0;

  return (

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card>
          <OrderListToolbar numSelected={selected.length} filterName={filterId} onFilterName={handleFilterById} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <OrderListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={orders.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, total, from, status, orderAt } = row;
                    const isItemSelected = selected.indexOf(id) !== -1;
                    let statusColor = ''
                    if(status === 'new' || status === 'ready' || status === 'shipping' || status === 'accepted'){
                      statusColor = 'warning'
                    }else if(status === 'cancelled' || status === 'rejected' || status === 'lost'){
                        statusColor = 'error'
                    }else{
                      statusColor = 'success'
                    }
                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, id)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                        <Box
                            sx={{
                              py: 2,
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <ThumbImgStyle alt={from?.name} src={from?.image} />
                            <Typography variant="subtitle2" noWrap>
                              {from?.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell style={{ minWidth: 160 }}>{fCurrency(total)}</TableCell>
                        <TableCell style={{ minWidth: 160 }}>{fDate(orderAt)}</TableCell>
                        <TableCell style={{ minWidth: 160 }}>
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={statusColor}
                          >
                            {status?.toUpperCase()}
                          </Label>
                        </TableCell>
                        <TableCell align="right">
                          <OrderMoreMenu  orderId={id} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isOrdersNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterId} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
  );
}

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from "moment";

import { useSelector, useDispatch } from 'react-redux';

import {
  fetchAll,
  setOrder,
  setOrderBy,
  setSelected,
  setPage,
  setRowsPerPage,
  selectOrder,
  selectOrderBy,
  selectSelected,
  selectPage,
  selectRowsPerPage,
  selectInstances,
  deleteInstance,
  stopInstance,
  startInstance
} from './instanceSlice';

import { selectNav } from '../navigation/navigationSlice';

import { lighten, makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';

import ConfirmationBox from './ConfirmationBox';
import YesNoBox from './YesNoBox';

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

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'id', numeric: false, disablePadding: true, label: 'Desktop ID' },
  { id: 'machine_def_id', sortDisabled: false, numeric: false, disablePadding: true, label: 'Machine Type' },
  { id: 'state', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'pending_action', numeric: false, disablePadding: false, label: 'Pending Action' },
  { id: 'launchtime', numeric: false, disablePadding: false, label: 'Launch Date/Time' },
  { id: 'screengeometry', sortDisabled: false, numeric: false, disablePadding: false, label: 'Screen Geometry' },
  { id: 'actions', sortDisabled: true, numeric: false, disablePadding: false, label: 'Actions' }
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortDisabled ?
              <p>{headCell.label}</p>
            : <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
            }
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const dispatch = useDispatch();

  const { numSelected } = props;

  const [ anchorEl, setAnchorEl ] = useState(null);
  const [ confirmationBoxOpen, setConfirmationBoxOpen ] = useState(false);
  const [ shutdownBoxOpen, setShutdownBoxOpen ] = useState(false);

  const selected = useSelector(selectSelected);
  const instances = useSelector(selectInstances);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openConfirmationBox = (event) => {
    setConfirmationBoxOpen(true);
    setAnchorEl(null);
  }

  const openShutdownBox = (event) => {
    setShutdownBoxOpen(true);
    setAnchorEl(null);
  }

  const closeConfirmationBox = (event) => {
    setConfirmationBoxOpen(false);
  }

  const closeShutdownBox = (event) => {
    setShutdownBoxOpen(false);
  }

  const terminateInstance = () => {
    setConfirmationBoxOpen(false);
    dispatch(deleteInstance({id: selected[0]}));
  }

  const shutdownInstance = () => {
    dispatch(stopInstance({id: selected[0]}));
  }

  const selectedInstanceState = () => {
    const instance = instances.filter(instance => instance.id === selected[0]);
    return instance[0].state;
  }

  const startOrStopInstance = () => {
    if(selectedInstanceState() === "running") {
      openShutdownBox();
    } else {
      dispatch(startInstance({id: selected[0]}));
      setAnchorEl(null);
    }
  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Instances
        </Typography>
      )}

      {numSelected > 0 ? (
        <div>
          <Tooltip title="Get more information">
            <IconButton aria-label="menu" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={openConfirmationBox}>Terminate</MenuItem>
            <MenuItem onClick={startOrStopInstance}>{selectedInstanceState() === "running" ? "Shutdown" : "Startup"}</MenuItem>
          </Menu>
          <ConfirmationBox 
            open={confirmationBoxOpen} 
            close={closeConfirmationBox}
            terminate={terminateInstance}
          />
          <YesNoBox
            open={shutdownBoxOpen}
            close={closeShutdownBox}
            title="Shutdown Desktop"
            message="Are you sure you want to shutdown your desktop?  You will lose any unsaved data.  This action cannot be undone once started."
            yes={shutdownInstance}
          />
        </div>
      ) : (
        <div/>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function PipelineTable() {
  const rows = useSelector(selectInstances)
  const classes = useStyles();
  const dispatch = useDispatch();

  const order = useSelector(selectOrder);
  const orderBy = useSelector(selectOrderBy);
  const selected = useSelector(selectSelected);
  const page = useSelector(selectPage);
  const rowsPerPage = useSelector(selectRowsPerPage);
  const nav = useSelector(selectNav);

  const [loadPage] = useState(0);

  useEffect(() => {
    dispatch(fetchAll())
  }, [loadPage, dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    dispatch(setOrder(isAsc ? 'desc' : 'asc'));
    dispatch(setOrderBy(property));
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    // very simple logic as only one item can be selected at once
    if (selectedIndex === -1) {
      newSelected.push(name);
    }
    dispatch(setSelected(newSelected));
  };

  const handleChangePage = (event, newPage) => {
    dispatch(setPage(newPage));
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(setRowsPerPage(parseInt(event.target.value, 10)));
    dispatch(setPage(0));
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const instanceFilter = instance => {
    if(nav === "all") {
      return true;
    }
    if(nav === "running") {
      return instance.state === "running";
    }
    if(nav === "stopped") {
      return instance.state !== "running"
    }
    return false;
  }

  var launchDesktopWindow = function(id, event) {
    const currentUrl = new URL(window.location);
    //const protocol = currentUrl.protocol;
    //const hostname = currentUrl.hostname;
    const protocol = "https";
    const hostname = "desktops.tstaucloud.com";
    window.open(protocol + "://" + hostname + "/desktop/" + id + "/workstation-0.0.1/", "_blank");
    event.stopPropagation();
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .filter(instanceFilter)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.id}
                      </TableCell>
                      <TableCell align="left">{row.machine_def_id}</TableCell>
                      <TableCell align="left">{row.state.replace(/\b\w/g, l => l.toUpperCase())}</TableCell>
                      <TableCell align="left">{row.pending_action}</TableCell>
                      <TableCell align="left">{moment.utc(row.launchtime).fromNow()}</TableCell>
                      <TableCell align="left">{row.screengeometry}</TableCell>
                      <TableCell align="left">
                        {row.state === "running" && <Button color="primary" onClick={launchDesktopWindow.bind(this, row.id)}>
                          Launch Desktop
                        </Button>}
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
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
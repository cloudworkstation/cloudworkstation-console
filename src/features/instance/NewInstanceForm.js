import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { red, green, blue } from '@material-ui/core/colors';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import {
  createInstance,
  selectOpenNewDesktopForm,
  setOpenNewDesktopForm
} from './instanceSlice';

import { useSelector, useDispatch } from 'react-redux';


export default function CreateNewInstance(props) {
  const dispatch = useDispatch();

  const open = useSelector(selectOpenNewDesktopForm);

  /*const useStyles = makeStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
  });

  const classes = useStyles();*/

  return (
    <div>
      <Dialog fullWidth={true} maxWidth="md" open={open} onClose={() => {}} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Launch New Desktop</DialogTitle>
        <DialogContent>
          <DialogContentText>
            
          </DialogContentText>
        
          
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {dispatch(setOpenNewDesktopForm(false))}} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
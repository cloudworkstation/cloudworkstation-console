import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function YesNoBox(props) {

  const closeBox = (event) => {
    props.close();
  }

  const yesCloseBox = (event) => {
    props.yes();
    props.close();
  }

  return (
    <div>
      <Dialog fullWidth={true} maxWidth="md" open={props.open} onClose={() => {}} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBox} color="primary">
            No
          </Button>
          <Button onClick={yesCloseBox} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
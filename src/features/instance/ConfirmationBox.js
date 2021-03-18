import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

export default function ConfirmationBox(props) {
  const [ deletePhrase, setDeletePhrase ] = useState("");
  const [ deletePhraseError, setDeletePhraseError ] = useState("");

  const handleDeletePhraseChange = (event) => {
    setDeletePhrase(event.target.value);
  }

  const checkPhrase = (event) => {
    if(deletePhrase === "terminate desktop") {
      setDeletePhrase("");
      props.terminate();
    } else {
      setDeletePhraseError("Delete phrase is wrong")
    }
  }

  const closeBox = (event) => {
    setDeletePhrase("");
    props.close();
  }

  return (
    <div>
      <Dialog fullWidth={true} maxWidth="md" open={props.open} onClose={() => {}} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Terminate Desktop</DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you terminate this desktop all the data stored on it will be lost and cannot be recovered.  If you are sure type 'terminate desktop' below.
          </DialogContentText>
          <TextField
            autoFocus
            id="canwedelete"
            label="Delete phrase"
            value={deletePhrase}
            onChange={handleDeletePhraseChange}
            fullWidth
            helperText={deletePhraseError}
            error={!deletePhraseError === ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBox} color="primary">
            Close
          </Button>
          <Button onClick={checkPhrase} color="primary">
            Terminate
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
import React from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core";

function ConfirmationModal({ msg, onClose, open, onConfirm }) {
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Typography>{msg}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="primary" onClick={onConfirm}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ConfirmationModal;

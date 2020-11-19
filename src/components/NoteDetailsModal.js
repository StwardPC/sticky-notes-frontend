import React, { forwardRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from "@material-ui/core";
import Slide from "@material-ui/core/Slide";

// SLIDE UP ANIMATION FOR MODALS
const slideUp = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function NoteDetails({ item, onOpen, onClose }) {
  return (
    <Dialog
      open={onOpen}
      onClose={onClose}
      scroll="paper"
      TransitionComponent={slideUp}
      keepMounted
    >
      <DialogTitle>Details</DialogTitle>
      <DialogContent>
        <h2>{item.category}</h2>
        <p>{item.body}</p>
        <DialogContentText>{item.date}</DialogContentText>
        <DialogContentText>{item.author.username}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default NoteDetails;

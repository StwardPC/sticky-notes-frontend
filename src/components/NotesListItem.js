import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  makeStyles,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@material-ui/core";
import { Edit, DeleteForever } from "@material-ui/icons";
import ConfirmationModal from "./ConfirmationModal";

function EditNoteModal({ open, onClose, item }) {
  const cInput = useRef();
  const bInput = useRef();

  // UPDATE BUTTON STATUS
  const [disable, setDisable] = useState(true);

  const editNote = (event) => {
    event.preventDefault();

    const category = cInput.current.value;
    const body = bInput.current.value;

    const editNoteRequest = {
      query: `
      mutation {
        editNote (_id: "${item._id}", category: "${category}", body: "${body}") {
          _id
          category
          body
        }
      }
    `,
    };

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(editNoteRequest),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status != 200 && res.status != 201) {
          console.log("no 200 response");
        } else {
          return res.json();
        }
      })
      .then((res) => {
        onClose();
      })
      .catch(() => {
        throw new Error("Cannot edit note atm");
      });
  };

  const onChangeHandler = () => {
    if (
      item.category.toString() != cInput.current.value ||
      item.body.toString() != bInput.current.value
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} onEnter={onChangeHandler}>
        <DialogTitle>Update note content</DialogTitle>
        <form onSubmit={editNote} autoComplete="off">
          <DialogContent>
            <TextField
              label="Category"
              variant="outlined"
              defaultValue={item.category}
              onChange={onChangeHandler}
              inputRef={cInput}
            />
            <TextField
              label="Body"
              variant="outlined"
              multiline
              defaultValue={item.body}
              onChange={onChangeHandler}
              inputRef={bInput}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" color="primary" disabled={disable}>
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

function ListItem({ item }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const closeHandler = () => {
    setOpen(false);
  };

  const openHandler = () => {
    setOpen(true);
  };

  const closeConfirmHandler = () => {
    setConfirm(false);
  };

  const openConfirmHandler = () => {
    setConfirm(true);
  };

  const deleteNote = () => {
    const deleteNoteRequest = {
      query: `
        mutation {
          deleteNote (_id: "${item._id}") {
            _id
            category
            body
          }
        }        
      `,
    };

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(deleteNoteRequest),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status != 200 && res.status != 201) {
          console.log("no 200 response on delete");
        } else {
          return res.json();
        }
      })
      .then(() => {
        closeConfirmHandler();
      })
      .catch(() => {
        throw new Error("Cannot delete note atm");
      });
  };

  const alertmsg = "Are you sure?";

  return (
    <li>
      <Card>
        <CardContent>
          <h2>{item.category}</h2>
          <h3>{item.body}</h3>
          <h3>{item.date}</h3>
          <h3>{item.author.username}</h3>
          <IconButton
            aria-label="Add"
            variant="contained"
            color="primary"
            size="medium"
            onClick={openHandler}
          >
            <Edit />
          </IconButton>
          <IconButton
            aria-label="Add"
            variant="contained"
            color="secondary"
            size="medium"
            onClick={openConfirmHandler}
          >
            <DeleteForever />
          </IconButton>
          <EditNoteModal open={open} onClose={closeHandler} item={item} />
          <ConfirmationModal
            onClose={closeConfirmHandler}
            open={confirm}
            onConfirm={deleteNote}
            msg={alertmsg}
          />
        </CardContent>
      </Card>
    </li>
  );
}

export default ListItem;

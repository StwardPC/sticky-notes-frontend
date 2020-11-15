import React, { useState, useRef, useContext, useEffect } from "react";
import {
  IconButton,
  Button,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContentText,
  DialogContent,
  TextField,
  Box,
  Card,
  CardContent,
} from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import { AuthContext } from "../App";
import NotesList from "../components/NotesList";

const useStyles = makeStyles({
  roundBorders: {
    borderRadius: 20,
  },
  removedListStyle: {
    listStyle: "none",
  },
  noteCard: {
    minHeight: 160,
    maxWidth: 200,
  },
});

// COMPONENT FOR THE MODAL AND CREATING A NOTE ON IT
function CreateNoteModal({ onClose, open, updateNotesList }) {
  const authContext = useContext(AuthContext);
  const { token } = authContext.state;

  // Textfield references
  const cInput = useRef();
  const bInput = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    const category = cInput.current.value;
    const body = bInput.current.value;

    console.log(category, body);

    const createNoteRequest = {
      query: `
        mutation {
          createNote (nInput: {category: "${category}", body: "${body}"}),
          {
            _id
            category
            body
            date
            author {
              _id
            }
          }
        }
    `,
    };

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(createNoteRequest),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status != 200 && res.status != 201) {
          throw new Error("Sorry, request error");
        } else {
          return res.json();
        }
      })
      .then((res) => {
        console.log(res);
        onClose();
        updateNotesList();
      })
      .catch(() => {
        throw new Error("Didn't create a note at all");
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create note</DialogTitle>
      <form onSubmit={submitHandler} autoComplete="off">
        <DialogContent>
          <TextField
            label="Category"
            variant="outlined"
            required
            placeholder="Family, School, To-Do, etc"
            inputRef={cInput}
          />
          <TextField
            label="Body"
            variant="outlined"
            multiline
            required
            inputRef={bInput}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" color="primary">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function NotesView() {
  // CURRENT USER STATE
  const authContext = useContext(AuthContext);
  const { isAuthenticated, token, userID } = authContext.state;

  // USER NOTES STATE
  const [userNotes, setUserNotes] = useState(null);

  // STATE FOR THE MODAL
  const [open, setOpen] = useState(false);

  // HANDLERS FOR THE CREATE NOTE MODAL
  const openHandler = () => {
    setOpen(true);
  };

  const closeHandler = () => {
    setOpen(false);
  };

  // METHOD FOR GETTING EVERY NOTE CREATED BY THE CURRENT USER
  const getNotes = () => {
    const getNotesRequest = {
      query: `
        query {
            userNotes (unInput: {_id: "${userID}"})
              {
                _id
                category
                body
                date
                author {
                  username
                }
              }
        }   
    `,
    };

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(getNotesRequest),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status != 200 && res.status != 201) {
          throw new Error("No 200 response");
        } else {
          return res.json();
        }
      })
      .then((res) => {
        setUserNotes(res.data.userNotes);
      })
      .catch(() => {
        throw new Error("Could not get notes at all");
      });
  };

  // ON LOAD, GET THE NOTES
  useEffect(() => {
    getNotes();
  }, []);

  return (
    <>
      <div>
        <IconButton
          aria-label="Add"
          variant="contained"
          color="primary"
          size="medium"
          onClick={openHandler}
        >
          <AddCircle />
        </IconButton>
        <CreateNoteModal
          open={open}
          onClose={closeHandler}
          updateNotesList={getNotes}
        />
      </div>
      <div>
        {userNotes ? <NotesList data={userNotes} /> : <h1>No notes</h1>}
      </div>
    </>
  );
}

export default NotesView;

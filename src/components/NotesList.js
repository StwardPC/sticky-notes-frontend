import React, { useContext, useEffect } from "react";
// import { AuthContext } from "../App";
import { Box, Card, CardContent, makeStyles } from "@material-ui/core";
import ListItem from "./NotesListItem";

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

function NotesList({ data }) {
  const classes = useStyles();

  return (
    <>
      <Box>
        <ul className={classes.removedListStyle}>
          {data &&
            data.map((item, index) => {
              return <ListItem key={index} item={item} />;
            })}
        </ul>
      </Box>
    </>
  );
}

export default NotesList;

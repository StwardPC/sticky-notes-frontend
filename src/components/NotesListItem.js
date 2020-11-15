import React from "react";
import { Box, Card, CardContent, makeStyles } from "@material-ui/core";

function ListItem({ item }) {
  return (
    <li>
      <Card>
        <CardContent>
          <h2>{item.category}</h2>
          <h3>{item.body}</h3>
          <h3>{item.date}</h3>
          <h3>{item.author.username}</h3>
        </CardContent>
      </Card>
    </li>
  );
}

export default ListItem;

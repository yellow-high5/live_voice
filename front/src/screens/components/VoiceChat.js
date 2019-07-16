import React from "react";

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";


const styles = theme => ({
  bubble: {
    width: "360px",
    height: "auto",
    display: "block",
    backgroundColor: "transparent",
    border: "2px solid #FFFFFF",
    borderRadius: 4,
    boxShadow: "2 8 5px #000",
    position: "relative",
    margin: "0 0 25"
  },
  txt: {
    padding: "8px 55px 8px 14px"
  },
  name: {
    fontWeight: 600,
    fontSize: 12,
    margin: "0 0 4",
    color: "#FFFFFF",
    span: {
      fontWeight: "normal",
      color: "#b3b3b3"
    }
  },
  message: {
    fontSize: 12,
    margin: 0,
    color: "#FFFFFF"
  },
  timestamp: {
    fontSize: 11,
    position: "absolute",
    right: 10,
    textTransform: "uppercase",
    color: "#999"
  }
});

const VoiceChat = ({ classes, voices, socket }) => {
  return (
    <Paper className={classes.voices_chat_paper}>
      <List component="div">
        {voices.map(voice => {
          return(
            <ListItem style={{display: "flex", justifyContent: `${voice.socket === socket.id ? "flex-start" : "flex-end" }` }}>
              <div className={classes.bubble} style={{backgroundColor: `${voice.socket === socket.id ? "rgba(255,255,255, 0.2)" : "transparent" }`}}>
                <div className={classes.txt}>
                  <Typography variant="h6" color="secondary" className={classes.name}>
                    {voice.emitter}
                    <span className={classes.timestamp}>{voice.timestamp}</span>
                  </Typography>
                  <Typography
                    variant="h6"
                    color="secondary"
                    className={classes.message}
                  >
                    {voice.content}
                  </Typography>
                </div>
              </div>
            </ListItem>
          )
        })}
      </List>
    </Paper>
  );
};


export default withStyles(styles)(VoiceChat);

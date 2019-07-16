import React from "react";

import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";


const styles = theme => ({
  speech_wrapper: {
    position: "absolute"
  },
  bubble: {
    width: 240,
    height: "auto",
    display: "block",
    backgroundColor: "transparent",
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

//ビデオオン時はサイドリスト表示、それ以外はリスト表示かランダム表示
const VoiceRandom = ({ classes, voices, socket }) => {
  return (
    <div>
      {voices.map(voice => {
        return(
          <div
            className={classes.speech_wrapper}
            style={{ left: `calc(${voice.position_x}% - 240px)`, top: `calc(${voice.position_y}%)` }}
          >
            <div className={classes.bubble} style={{border: `2px solid ${voice.socket === socket.id ? "#FCEE21" : "#FFFFFF"}`}}>
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
              <div className={classes.bubble_arrow} />
            </div>
          </div>
        )
      })}
    </div>
  );
};


export default withStyles(styles)(VoiceRandom);

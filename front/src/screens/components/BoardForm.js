import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import { Image, Send } from "@material-ui/icons";

const moment = require("moment");

const inner_theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FCEE21"
    },
    secondary: {
      main: "#FFFFFF"
    }
  },
  overrides: {
    MuiFormLabel: {
      root: {
        color: "#FFFFFF"
      }
    },
    MuiInputBase: {
      root: {
        fontSize: "medium",
        color: "#FFFFFF",
        "&:hover": {
          borderColor: "#FBB03B"
        }
      }
    },
  }
});

export const BoardForm = ({
  classes,
  channel,
  name,
  onVoice,
  myvoice,
  onChange,
  sendPress,
  socket
}) => {
  return (
    <MuiThemeProvider theme={inner_theme}>
      <AppBar position="fixed" color="default" className={classes.underbar}>
        <FormControl
          onKeyDown={e => {
            if (e.keyCode === 13) {
              const data = {
                channel: channel,
                content: myvoice,
                emitter: name,
                position_x: Math.floor(100 * Math.random()) + 1,
                position_y: Math.floor(100 * Math.random()) + 1,
                socket: socket.id,
                timestamp: moment().format("MM/DD HH:mm")
              }
              sendPress(data);
              socket.emit("SEND_VOICE", data);
            }
          }}
        >
          <TextField
            disabled={onVoice?false:true}
            type="text"
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" variant="outlined">
                  <IconButton
                    variant="contained"
                    onClick={() => {
                      const data = {
                        channel: channel,
                        content: myvoice,
                        emitter: name,
                        position_x: Math.floor(100 * Math.random()) + 1,
                        position_y: Math.floor(100 * Math.random()) + 1,
                        socket: socket.id,
                        timestamp: moment().format("MM/DD HH:mm")
                      }
                      sendPress(data);
                      socket.emit("SEND_VOICE", data);
                    }}
                  >
                    <Send className={classes.icon} />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end" variant="outlined">
                  <IconButton variant="contained">
                    <Image className={classes.icon} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            value={myvoice}
            onChange={e => onChange(e.target.value)}
          />
        </FormControl>
      </AppBar>
    </MuiThemeProvider>
  );
};

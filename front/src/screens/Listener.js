import React from "react";
import { connect } from "react-redux";

import { inputChannel, inputName, findChannel } from "../actions";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import { ArrowBack, LiveTv } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";

const inner_theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ffffff"
    },
    secondary: {
      main: "#FCEE21"
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
        fontSize: "xx-large",
        color: "#FFFFFF",
        "&:hover": {
          borderColor: "#FCEE21"
        }
      }
    },
    MuiInput: {
      underline: {
        "&:before": {
          borderBottom: "1px solid #FFFFFF"
        },
        "&:after": {
          borderBottom: "3px solid #FCEE21"
        }
      }
    },
    MuiButtonBase: {
      root: {
        background: "linear-gradient(45deg, #FCEE21 0%, #FBB03B 100%)",
        "&$disabled": {
          background: "rgba(255,255,255,0.8)!important",
          border: "3px solid #FFFFFF!important"
        }
      }
    }
  }
});

const styles = theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#282c34",
    width: "100vw",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
    color: "white"
  },
  formControl: {
    width: "360px",
    height: "500px",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridTemplateRows: "repeat(10, 1fr)"
  },
  channelField: {
    gridColumn: "1 / 5",
    gridRow: "3 / 5",
    color: "#FFFFFF",
    borderColor: "white",
    margin: theme.spacing.unit
  },
  nameField: {
    gridColumn: "1 / 5",
    gridRow: "6 / 8",
    color: "#FFFFFF",
    borderColor: "white",
    margin: theme.spacing.unit
  },
  icon: {
    margin: 5
  },
  back_button: {
    gridColumn: "1 / 2",
    gridRow: "1 / 3",
    background: "#FFFFFF",
    margin: theme.spacing.unit
  },
  subscribe_button: {
    gridColumn: "1 / 5",
    gridRow: "9 / 11",
    borderRadius: 50,
    height: 48,
    padding: "0 30px",
    color: "#FFFFFF",
    margin: theme.spacing.unit
  },
  progress_bar: {
    gridColumn: "1 / 5",
    gridRow: "2 / 3"
  },
  message: {
    gridColumn: "2 / 5",
    gridRow: "1 / 2"
  }
});

const transitionHome = history => {
  history.push("/");
};

const Listener = ({
  classes,
  history,
  channel,
  name,
  message,
  changeChannel,
  changeName,
  subscribeChannel,
  isFetching
}) => (
  <MuiThemeProvider theme={inner_theme}>
    <div className={classes.container}>
      <FormControl
        className={classes.formControl}
        onKeyDown={e => {
          if (e.keyCode === 13 && channel !== "") {
            subscribeChannel(name, channel, history);
          }
        }}
      >
        {isFetching ? (
          <LinearProgress color="secondary" className={classes.progress_bar} />
        ) : (
          <Fab
            size="medium"
            className={classes.back_button}
            onClick={() => transitionHome(history)}
          >
            <ArrowBack className={classes.icon} />
          </Fab>
        )}
        <Typography variant="h6" color="inherit" className={classes.message}>
          {message}
        </Typography>
        <TextField
          label="Channel Code*"
          className={classes.channelField}
          type="text"
          margin="normal"
          value={channel}
          onChange={e => changeChannel(e.target.value)}
          autoFocus={true}
        />
        <TextField
          label="Your Name"
          placeholder="Anonymous🤡"
          className={classes.nameField}
          type="text"
          margin="normal"
          value={name}
          onChange={e => changeName(e.target.value)}
        />
        <IconButton
          variant="contained"
          className={classes.subscribe_button}
          onClick={() => subscribeChannel(name, channel, history)}
          disabled={channel === "" ? true : false}
        >
          <LiveTv className={classes.icon} /> Subscribe
        </IconButton>
      </FormControl>
    </div>
  </MuiThemeProvider>
);

const mapStateToProps = state => ({
  channel: state.channel,
  name: state.name,
  message: state.message,
  isFetching: state.fetchingListener
});

const mapDispatchToProps = dispatch => ({
  changeChannel: value => dispatch(inputChannel(value)),
  changeName: value => dispatch(inputName(value)),
  subscribeChannel: (name, channel, history) =>
    dispatch(findChannel(name, channel, history))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Listener)));

import React from "react";
import { connect } from "react-redux";

import { inputTitle, inputName, createLive } from "../actions";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import { ArrowBack, Mic } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";

const inner_theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ffffff"
    },
    secondary: {
      main: "#00FF02"
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
          borderColor: "#00FF02"
        }
      }
    },
    MuiInput: {
      underline: {
        "&:before": {
          borderBottom: "1px solid #FFFFFF"
        },
        "&:after": {
          borderBottom: "3px solid #00FF02"
        }
      }
    },
    MuiButtonBase: {
      root: {
        background: "linear-gradient(45deg, #00FF02 0%, #008002 100%)",
        '&$disabled': {
          background: "rgba(255,255,255,0.8)!important",
          border: "3px solid #FFFFFF!important",
        },
      },
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
  titleField: {
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
  start_button: {
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

const Performer = ({
  classes,
  history,
  title,
  name,
  changeTitle,
  changeName,
  startLive,
  isFetching
}) => (
  <MuiThemeProvider theme={inner_theme}>
    <div className={classes.container}>
      <FormControl
        className={classes.formControl}
        onKeyDown={e => {
          if (e.keyCode === 13 && title!=="") {
            startLive(name, title, history);
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
          {isFetching ? "Starting Live..." : ""}
        </Typography>
        <TextField
          label="YOUR LIVE*"
          className={classes.titleField}
          type="text"
          margin="normal"
          value={title}
          onChange={e => changeTitle(e.target.value)}
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
          className={classes.start_button}
          onClick={() => startLive(name, title, history)}
          disabled={title===""?true:false}
        >
          <Mic className={classes.icon} /> Start Your Live
        </IconButton>
      </FormControl>
    </div>
  </MuiThemeProvider>
);

const mapStateToProps = state => ({
  title: state.title,
  name: state.name,
  isFetching: state.fetchingPerformer
});

const mapDispatchToProps = dispatch => ({
  changeTitle: value => dispatch(inputTitle(value)),
  changeName: value => dispatch(inputName(value)),
  startLive: (name, title, history) =>
    dispatch(createLive(name, title, history))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Performer)));

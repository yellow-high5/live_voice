import React from "react";
import { withRouter } from "react-router";
import logo from "../logo.svg";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#282c34",
    width: "100vw",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF"
  },
  title: {
    fontWeight: 800,
    fontFamily: "Monoton"
  },
  logo: {
    width: 200,
    height: 200,
    margin: "40px 0"
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  start_button: {
    fontWeight: 800,
    fontFamily: "Monoton",
    background: "linear-gradient(45deg, #00FF02 0%, #008002 100%)",
    borderRadius: 3,
    border: 0,
    color: "white",
    height: 48,
    padding: "0 30px",
    margin: "40px 20px"
  },
  subscribe_button: {
    fontWeight: 800,
    fontFamily: "Monoton",
    background: "linear-gradient(45deg, #FCEE21 0%, #FBB03B 100%)",
    borderRadius: 3,
    border: 0,
    color: "white",
    height: 48,
    padding: "0 30px",
    margin: "40px 20px"
  }
});

const Home = ({ classes, history }) => (
  <div className={classes.container}>
    <Typography variant="h3" color="inherit" className={classes.title}>
      LIVE VOICE
    </Typography>
    <img src={logo} alt="logo" className={classes.logo} />
    <div className={classes.buttons}>
      <Button
        variant="outlined"
        color="inherit"
        className={classes.start_button}
        onClick={() => history.push("/performer")}
      >
        START LIVE
      </Button>
      <Button
        variant="outlined"
        color="inherit"
        className={classes.subscribe_button}
        onClick={() => history.push("/listener")}
      >
        Subscribe
      </Button>
    </div>
  </div>
);

export default withRouter(withStyles(styles)(Home));

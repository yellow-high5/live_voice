import React from "react";
import { withRouter } from "react-router";
import nomatch from "../nomatch.svg";
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
  nomatch: {
    width: 200,
    height: 200,
    margin: "40px 0"
  },
  home_button: {
    fontWeight: 800,
    fontFamily: "Monoton",
    background: "linear-gradient(45deg, #FFFFFF 0%, #282c34 100%)",
    borderRadius: 3,
    border: 0,
    color: "white",
    height: 48,
    padding: "0 30px",
    margin: "40px 20px"
  }
});

const NoMatch = ({ classes, history }) => (
  <div className={classes.container}>
    <Typography variant="h4" color="inherit" className={classes.title}>
      Sorry, No LIVE here...
    </Typography>
    <img src={nomatch} alt="nomatch" className={classes.nomatch} />
    <Button
      variant="outlined"
      color="inherit"
      className={classes.home_button}
      onClick={() => history.push("/")}
    >
      Back Home
    </Button>
  </div>
);

export default withRouter(withStyles(styles)(NoMatch));

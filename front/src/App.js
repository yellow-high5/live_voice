import React, { Component } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./screens/Home";
import Performer from "./screens/Performer";
import Listener from "./screens/Listener";
import Board from "./screens/Board";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ffffff"
    }
  }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <BrowserRouter>
            <div>
              <Route exact path="/" component={Home} />
              <Route path="/performer" component={Performer} />
              <Route path="/listener" component={Listener} />
              <Route path="/board" component={Board} />
            </div>
          </BrowserRouter>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;

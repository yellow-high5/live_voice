import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './screens/Home';
import Performer from './screens/Performer';
import Listener from './screens/Listener';
import Board from './screens/Board';
import NoMatch from './screens/NoMatch';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ffffff'
    }
  }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/performer" component={Performer} />
              <Route path="/listener" component={Listener} />
              <Route path="/board/:channel" component={Board} />
              <Route component={NoMatch} />
            </Switch>
          </BrowserRouter>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;

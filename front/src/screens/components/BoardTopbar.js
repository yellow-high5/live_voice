import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import logo from "../../logo.svg";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import { Mic, LiveTv } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import { BoardMemberList } from "./BoardMemberList";

import copy from 'copy-to-clipboard';

const inner_theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FFFFFF"
    },
    secondary: {
      main: "#FFFFFF"
    }
  }
});


export const BoardTopbar = ({ classes, title, channel, isPerformer, clickLogo, clickMike, clickAway, open, members }) => {
  return (
    <MuiThemeProvider theme={inner_theme}>
      <AppBar position="static">
        <Toolbar className={classes.topbar}>
          {isPerformer ?
            <Tooltip title="Live Settings" placement="bottom">
              <ButtonBase onClick={() => {
                clickLogo();
              }}>
                <img src={logo} alt="logo" className={classes.logo} />
              </ButtonBase>
            </Tooltip> :
            <Tooltip title="Live Settings" placement="bottom">
              <ButtonBase onClick={() => {
                clickLogo();
              }}>
                <img src={logo} alt="logo" className={classes.logo} />
              </ButtonBase>
            </Tooltip>
          }
          <ClickAwayListener onClickAway={clickAway}>
            <div className={classes.title}>
              <Tooltip title="Member List" placement="bottom">
                <IconButton variant="contained" onClick={() => clickMike()}>
                  <Badge badgeContent={members.length} color="primary">
                    <Mic className={classes.topbar_icon} />
                  </Badge>
                </IconButton>
              </Tooltip>
              {open ? (
                <BoardMemberList classes={classes} members={members}/>
              ) : null}
              <Typography color="secondary" variant="h5">
                {title}
              </Typography>
            </div>
          </ClickAwayListener>
          <div className={classes.channel}>
            <Tooltip title="Copy Channel!" placement="bottom">
              <IconButton variant="contained" onClick={() => copy(channel)}>
                <LiveTv className={classes.topbar_icon} />
              </IconButton>
            </Tooltip>
            <Typography color="secondary" variant="h6">
              {channel}
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
    </MuiThemeProvider>
  );
};


// <ButtonBase disabled>
//   <img src={logo} alt="logo" className={classes.logo} />
// </ButtonBase>

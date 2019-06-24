import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CameraIcon from '@material-ui/icons/Camera';
import CastConnectedIcon from '@material-ui/icons/CastConnected';
import SettingsIcon from '@material-ui/icons/Settings';

import Swal from 'sweetalert2';

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
    MuiPaper: {
      root: {
        backgroundColor: "#282c34!important",
        top: "64px!important",
        height: "calc(100vh - 144px)!important",
      }
    },
    MuiListItemIcon: {
      root: {
        color: "#FFFFFF",
      }
    },
    MuiListItemText: {
      primary: {
        fontWeight: "bold",
        color: "#FFFFFF",
      }
    }
  }
});

export const BoardController = ({ classes, open, closeController }) => {
  return (
    <MuiThemeProvider theme={inner_theme}>
      <Drawer open={open} onClose={() => {closeController()}} className={classes.drawer}>
        <List className={classes.board_control_menu}>
          <ListItem button onClick={() => {
            closeController();
            startSelfy(closeController)
          }}>
            <ListItemIcon>
              <CameraIcon />
            </ListItemIcon>
            <ListItemText primary={'カメラを起動'} />
          </ListItem>
          <ListItem button onClick={() => {
            closeController();
            shareScreen(closeController)
          }}>
            <ListItemIcon>
              <CastConnectedIcon />
            </ListItemIcon>
            <ListItemText primary={'デスクトップを表示'} />
          </ListItem>
          <ListItem button onClick={() => {
            closeController();
            openSettings(closeController)
          }}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={'設定'} />
          </ListItem>
        </List>
      </Drawer>
    </MuiThemeProvider>
  );
};

const startSelfy = () => {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
  window.URL = window.URL || window.webkitURL;

  let video = document.getElementById('video');
  //let localStream = null;
  navigator.getUserMedia({video: true, audio: true},
    function(stream) {
      console.log(stream);
      video.srcObject = stream;
    },
    function(err) {
      console.log(err);
    }
  );
}

const shareScreen = () => {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
  window.URL = window.URL || window.webkitURL;

  let video = document.getElementById('video');
  //let localStream = null;
  navigator.mediaDevices.getUserMedia({video: {mediaSource: "screen"}},
    function(stream) {
      console.log(stream);
      video.srcObject = stream;
    },
    function(err) {
      console.log(err);
    }
  );
}

const openSettings = () => {
  Swal.fire({
    text: 'Settings',
    type: 'success',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'save'
  }).then((result) => {
    console.log('save!')
  })
}

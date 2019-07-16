import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';

import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import CastConnectedIcon from '@material-ui/icons/CastConnected';
import CastConnectedOffIcon from '@material-ui/icons/Cast';
import VoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import VoiceOverOffIcon from '@material-ui/icons/VoiceOverOff';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import SpeakerNotesOffIcon from '@material-ui/icons/SpeakerNotesOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomInIcon from '@material-ui/icons/ZoomIn';

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
    MuiDrawer: {
      modal: {
        top: "64px!important",
        position: "absolute !important",
      },
    },
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
    },
    MuiSwitch: {
    }
  }
});

export const BoardController = ({ classes, isPerformer, open, closeController, toggleSettings, onSelfy, onScreen, onSpeaker, onVoice, startSelfy, startScreen, stopVideo, videoVolume, videoZoom, changeVolume, changeZoom }) => {
  return (
    <MuiThemeProvider theme={inner_theme}>
      <Drawer paperAnchorBottom modal={"<div>hello</div>"} open={open} onClose={() => {closeController()}} className={classes.drawer}>
        <List className={classes.board_control_menu}>
        {isPerformer?
          <ListSubheader className={classes.board_control_subheader}>配信</ListSubheader>
          :
          null
        }
        {isPerformer?
          <ListItem>
            <ListItemIcon>
              {onSelfy? <VideocamIcon /> : <VideocamOffIcon />}
            </ListItemIcon>
            <ListItemText primary={'セルフィー撮影'} />
            <Switch
              onChange={() => {
                if(!onSelfy){
                  startSelfy();
                }
                else{
                  stopVideo();
                }
                toggleSettings('selfy');
              }}
              checked={onSelfy}
              value="selfy"
            />
          </ListItem>
          :
          null
        }
        {isPerformer?
          <ListItem>
            <ListItemIcon>
              {onScreen ? <CastConnectedIcon /> : <CastConnectedOffIcon />}
            </ListItemIcon>
            <ListItemText primary={'デスクトップ共有'} />
            <Switch
              onChange={async() => {
                if(!onScreen){
                  startScreen();
                }
                else{
                  stopVideo();
                }
                toggleSettings('screen');
              }}
              checked={onScreen}
              value="screen"
            />
          </ListItem>
          :
          null
        }
        {isPerformer?
          <ListItem>
            <ListItemIcon>
              {onSpeaker ? <VoiceOverIcon /> : <VoiceOverOffIcon />}
            </ListItemIcon>
            <ListItemText primary={'スピーカー'} />
            <Switch
              onChange={() => toggleSettings('speaker')}
              checked={onSpeaker}
              value="speaker"
            />
          </ListItem>
          :
          null
        }
          <ListSubheader className={classes.board_control_subheader}>設定</ListSubheader>
          <ListItem>
            <ListItemIcon>
              {onVoice ? <SpeakerNotesIcon /> : <SpeakerNotesOffIcon />}
            </ListItemIcon>
            <ListItemText primary={'ボイス表示'} />
            <Switch
              onChange={() => toggleSettings('voice')}
              checked={onVoice}
              value="speaker"
            />
          </ListItem>
          <ListItem>
            <Grid container spacing={2}>
              <Grid item>
                <VolumeDownIcon />
              </Grid>
              <Grid item xs>
                <Slider disabled={onSelfy || onScreen? false : true} min={0} max={1.0} step={0.01} value={videoVolume} onChange={(e, volume) => {changeVolume(volume);let video = document.getElementById('video');video.volume = volume;}} aria-labelledby="continuous-slider" />
              </Grid>
              <Grid item>
                <VolumeUpIcon />
              </Grid>
            </Grid>
          </ListItem>
          <ListItem>
            <Grid container spacing={2}>
              <Grid item>
                <ZoomOutIcon />
              </Grid>
              <Grid item xs>
                <Slider disabled={onSelfy || onScreen? false : true} min={1} max={3} step={0.01} value={videoZoom} onChange={(e, scale) => changeZoom(scale)} aria-labelledby="continuous-slider" />
              </Grid>
              <Grid item>
                <ZoomInIcon />
              </Grid>
            </Grid>
          </ListItem>
        </List>
      </Drawer>
    </MuiThemeProvider>
  );
};

import { combineReducers } from "redux";

const title = (state = "", action) => {
  switch (action.type) {
    case "INPUT_TITLE":
      return action.text;
    case "START_LIVE":
      return action.title;
    case "SUBSCRIBE_CHANNEL":
      return action.title;
    case "EXIT_LIVE":
      return "";
    default:
      return state;
  }
};

const channel = (state = "", action) => {
  switch (action.type) {
    case "INPUT_CHANNEL":
      return action.text;
    case "START_LIVE":
      return action.channel;
    case "SUBSCRIBE_CHANNEL":
      return action.channel;
    case "EXIT_LIVE":
      return "";
    default:
      return state;
  }
};

const name = (state = "", action) => {
  switch (action.type) {
    case "INPUT_NAME":
      return action.text;
    case "SUCCESS_FETCH":
      if(action.name === ""){
        return "Anonymous🤡"
      }
      return action.name;
    case "EXIT_LIVE":
      return "";
    default:
      return state;
  }
};

const message = (state = "", action) => {
  switch (action.type) {
    case "FETCH_CHANNEL":
      return "Connecting Channel...";
    case "SUCCESS_FETCH":
      return "";
    case "ERROR_FETCH":
      return "Not find your input Channel.";
    case "INPUT_CHANNEL":
      return "";
    default:
      return state;
  }
};

const fetchingPerformer = (state = false, action) => {
  switch (action.type) {
    case "FETCH_LIVE":
      return true;
    case "SUCCESS_FETCH":
      return false;
    case "ERROR_FETCH":
      return false;
    default:
      return state;
  }
};

const fetchingListener = (state = false, action) => {
  switch (action.type) {
    case "FETCH_CHANNEL":
      return true;
    case "SUCCESS_FETCH":
      return false;
    case "ERROR_FETCH":
      return false;
    default:
      return state;
  }
};

const isPerformer = (state = false, action) => {
  switch (action.type) {
    case "START_LIVE":
      return true;
    case "EXIT_LIVE":
      return false;
    default:
      return state;
  }
}

const voices = (state = [], action) => {
  switch (action.type) {
    case "SUBSCRIBE_CHANNEL":
      return action.voices
    case "RECEIVE_VOICE":
      let new_state = state;
      if (action.voice.content !== "") {
        new_state = [action.voice].concat(state);
      }
      return new_state;
      // let new_state = state;
      // if (action.voice.content !== "") {
      //   new_state.splice(0, 0, action.voice);
      // }
      // return new_state;
    case "EXIT_LIVE":
      return [];
    default:
      return state;
  }
};

const members = (state = [], action) => {
  switch (action.type) {
    case "RECEIVE_LIVE_INFO":
      return action.data
    default:
      return state;
  }
};

const myvoice = (state = "", action) => {
  switch (action.type) {
    case "INPUT_VOICE":
      return action.text;
    case "EMIT_VOICE":
      return "";
    case "EXIT_LIVE":
      return "";
    default:
      return state;
  }
};

const isOpenMemberList = (state = false, action) => {
  switch (action.type) {
    case "CLICK_MEMBER_LIST":
      return !state;
    case "CLICK_AWAY_MEMBER_LIST":
      return false;
    default:
      return state;
  }
}

const isOpenController = (state = false, action) => {
  switch (action.type) {
    case "TOGGLE_CONTROLLER":
      if(state === true){
        return false;
      }
      return true;
    default:
      return state;
  }
}

const onSelfy = (state = false, action) => {
  switch (action.type) {
    case "TOGGLE_SETTINGS":
      if(action.setting === 'selfy'){
        return !state;
      }
      else if(action.setting === 'screen'){
        return false;
      }
      return state
    case "EXIT_LIVE":
      return false;
    default:
      return state;
  }
}

const onScreen = (state = false, action) => {
  switch (action.type) {
    case "TOGGLE_SETTINGS":
      if(action.setting === 'screen'){
        return !state;
      }
      else if(action.setting === 'selfy'){
        return false;
      }
      return state;
    case "EXIT_LIVE":
      return false;
    default:
      return state;
  }
}

const onSpeaker = (state = false, action) => {
  switch (action.type) {
    case "TOGGLE_SETTINGS":
      if(action.setting === 'speaker'){
        return !state;
      }
      return state;
    case "EXIT_LIVE":
      return false;
    default:
      return state;
  }
}

const onVoice = (state = true, action) => {
  switch (action.type) {
    case "TOGGLE_SETTINGS":
      if(action.setting === 'voice'){
        return !state;
      }
      return state;
    case "EXIT_LIVE":
      return true;
    default:
      return state;
  }
}

const videoVolume = (state = 0.5, action) => {
  switch(action.type) {
    case "CHANGE_VOLUME":
      return action.volume;
    case "EXIT_LIVE":
      return 0.5;
    default:
      return state;
  }
}

const videoZoom = (state = 1.0, action) => {
  switch(action.type) {
    case "CHANGE_ZOOM":
      return action.scale;
    case "EXIT_LIVE":
      return 1.0;
    default:
      return state;
  }
}


export default combineReducers({
  title,
  channel,
  name,
  message,
  fetchingPerformer,
  fetchingListener,
  isPerformer,
  voices,
  members,
  myvoice,
  isOpenMemberList,
  isOpenController,
  onSelfy,
  onScreen,
  onSpeaker,
  onVoice,
  videoVolume,
  videoZoom,
});

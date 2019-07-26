export const inputTitle = text => ({
  type: "INPUT_TITLE",
  text
});

export const inputChannel = text => ({
  type: "INPUT_CHANNEL",
  text
});

export const inputName = text => ({
  type: "INPUT_NAME",
  text
});

export const receiveLiveInfo = data => ({
  type: "RECEIVE_LIVE_INFO",
  data
});

export const inputVoice = text => ({
  type: "INPUT_VOICE",
  text
});

export const receiveVoice = voice => ({
  type: "RECEIVE_VOICE",
  voice
});

export const emitVoice = voice => ({
  type: "EMIT_VOICE",
  voice
});

export const toggleController = () => ({
  type: "TOGGLE_CONTROLLER"
});

export const toggleSettings = setting => ({
  type: "TOGGLE_SETTINGS",
  setting
});

export const toggleOnSettings = setting => ({
  type: "TOGGLE_ON_SETTINGS",
  setting
});

export const toggleOffSettings = setting => ({
  type: "TOGGLE_OFF_SETTINGS",
  setting
});

export const changeVolume = volume => ({
  type: "CHANGE_VOLUME",
  volume
});

export const changeZoom = scale => ({
  type: "CHANGE_ZOOM",
  scale
});

export const clickMemberList = () => ({
  type: "CLICK_MEMBER_LIST"
});

export const clickAwayMemberList = () => ({
  type: "CLICK_AWAY_MEMBER_LIST"
});

const fetchLive = () => ({
  type: "FETCH_LIVE"
});

const fetchChannel = () => ({
  type: "FETCH_CHANNEL"
});

const successFetch = name => ({
  type: "SUCCESS_FETCH",
  name
});

const errorFetch = () => ({
  type: "ERROR_FETCH"
});

const startLive = (title, channel) => ({
  type: "START_LIVE",
  title,
  channel
});

const subscribeChannel = (title, channel, voices) => ({
  type: "SUBSCRIBE_CHANNEL",
  title,
  channel,
  voices
});

export const exitLive = () => ({
  type: "EXIT_LIVE"
});

//非同期アクション
const API_PATH = "http://localhost:9000";

export const createLive = (name, title, history) => dispatch => {
  dispatch(fetchLive());
  fetch(API_PATH + `/new_channel?title=${title}&name=${name}`, {
    method: "POST"
  })
    .then(res => {
      return res.json();
    })
    .then(result => {
      dispatch(startLive(result.title, result.channel));
      history.push(`/board/${result.channel}`);
      dispatch(successFetch(name));
    })
    .catch(err => {
      dispatch(errorFetch());
      //alert(err.message)
    });
};

export const findChannel = (name, channel, history) => dispatch => {
  dispatch(fetchChannel());
  fetch(API_PATH + `/check_channel?channel=${channel}&name=${name}`, {
    method: "GET"
  })
    .then(res => {
      return res.json();
    })
    .then(result => {
      dispatch(subscribeChannel(result.title, result.channel, result.voices));
      history.push(`/board/${result.channel}`);
      dispatch(successFetch(name));
    })
    .catch(err => {
      dispatch(errorFetch());
    });
};

import React from "react";
import { connect } from "react-redux";

import { receiveLiveInfo, inputVoice, receiveVoice, emitVoice, toggleController, toggleSettings, changeVolume, changeZoom, clickMemberList, clickAwayMemberList, exitLive } from "../actions";

import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";

import { BoardTopbar } from "./components/BoardTopbar";
import { BoardController } from "./components/BoardController";
import { BoardForm } from "./components/BoardForm";
import VoiceList from "./components/VoiceList";
import VoiceChat from "./components/VoiceChat";

import io from "socket.io-client";
import Swal from 'sweetalert2';

const styles = theme => ({
  container: {
    backgroundColor: "#282c34",
    width: "100vw",
    minHeight: "100vh"
  },
  topbar: {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    backgroundColor: "#282c34",
    color: "#FFFFFF"
  },
  logo: {
    gridColumn: "1 / 2",
    width: 36,
    height: 36,
    margin: "5px 10px"
  },
  title: {
    display: "flex",
    gridColumn: "2 / 8",
    alignItems: "center"
  },
  channel: {
    display: "flex",
    gridColumn: "8 / 13",
    alignItems: "center"
  },
  topbar_icon: {
    color: "#FFFFFF"
  },
  underbar: {
    backgroundColor: "#282c34",
    color: "#FFFFFF",
    top: "auto",
    bottom: 0
  },
  icon: {
    color: "#FFFFFF"
  },
  members_paper: {
    backgroundColor: "#282c34",
    position: "absolute",
    maxHeight: 180,
    top: 68,
    right: 0,
    left: 180,
    width: 160,
    padding: 5,
    overflow: "auto",
    zIndex: 999,
  },
  members_paper_item: {
    padding: 3,
  },
  members_paper_typo: {
    marginLeft: 5,
  },
  live_content: {
    position: "fixed",
    top: 64,
    width: "100vw",
    height: "calc(100vh - 144px)",
  },
  display: {
    position: "absolute",
    width: "100vw",
  },
  voices_list_paper: {
    backgroundColor: "rgba(16,17,20, 0.5)",
    position: "absolute",
    width: "25vw",
    height: "calc(100vh - 144px)",
    overflow: "auto",
    direction: "rtl",
  },
  voices_chat_paper: {
    backgroundColor: "rgba(16,17,20, 0.5)",
    width: "100vw",
    height: "calc(100vh - 144px)",
    overflow: "auto",
    direction: "rtl",
    margin: "auto",
  },
  drawer: {
    backgroundColor: "#282c34",
    position: "absolute",
    top: "64px",
    height: "calc(100vh - 144px)",
  },
  board_control_menu: {
    width: "300px",
    height: "100vh",
    color: "#FFFFFF",
    boxShadow: "10px 5px 5px 0px rgba(0,0,0,0.14)"
  },
  board_control_subheader: {
    color: "#FFFFFF",
    borderBottom: "1px solid #FFFFFF",
  },
});

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.socket = io(`http://localhost:8080/${props.channel}?name=${props.name}`);
    this.peerConnections = [];
    this.remoteVideos = [];
    this.video = document.getElementById('video');
    this.localStream = null;
    this.MAX_CONNECTION_COUNT = 3;

    //ライブ情報を受信
    this.socket.on('RECEIVE_LIVE_INFO', (data) => {
      console.log(data);
      props.receiveLiveInfo(data);
    })
    //メッセージを受信・更新
    this.socket.on('RECEIVE_VOICE', (data) => {
      props.receiveVoice(data);
    });
    //WebRTC
    this.socket.on('signaling', (data) => {
      let from = data.from;
      switch(data.type) {
        case "cast":
          if(!this.props.isPerformer){
            Swal.fire({
              text: '新たにビデオライブが配信されました。',
              type: 'warning',
              cancelButtonColor: '#FBB03B',
              confirmButtonText: 'Watch!'
            }).then((result) => {
              if (result.value) {
                this.connectVideo();
                this.props.toggleSettings('selfy');
              }
            })
          }
          break;
        case "call":
          this.makeOffer(from);
          break;
        case "offer":
          let offer = new RTCSessionDescription(data);
          this.setOffer(from, offer);
          break;
        case "answer":
          let answer = new RTCSessionDescription(data);
          this.setAnswer(from, answer);
          break;
        case "candidate":
          let candidate = new RTCIceCandidate(data.ice);
          console.log(candidate);
          this.addIceCandidate(from, candidate);
          break;
        case "end":
          if(!this.props.isPerformer){
            Swal.fire({
              text: 'ビデオ配信が終了しました。',
              type: 'alert',
              confirmButtonText: 'Yes'
            }).then((result) => {
              if (result.value) {
                this.detachVideo();
                this.props.toggleSettings('selfy');
              }
            })
          }
          break;
        default:
          break;
      }
    });
    //チャンネルの終了を受信
    this.socket.on('CLOSE_LIVE', () => {
      Swal.fire({
        text: 'チャンネルは終了しました！',
        type: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.value) {
          props.history.push('/');
        }
      })
    });

    //パフォーマーでないならビデオ接続スタート
    if(!this.props.isPerformer){
      this.connectVideo();
    }
  }

  emitBroadcast(data) {
    console.log(data);
    console.log(this.socket);
    this.socket.emit('signaling', data);
    if(data.type === "cast"){console.log("cast!!")}
  }
  emitTo(id, data) {
    data.to = id;
    this.socket.emit('signaling', data);
  }


  // --- RTCPeerConnections ---
  getConnectionCount() {
    return this.peerConnections.length;
  }
  canConnectMore() {
    return (this.getConnectionCount() < this.MAX_CONNECTION_COUNT);
  }
  isConnectedWith(id) {
    if (this.peerConnections[id])  {
      return true;
    }
    else {
      return false;
    }
  }
  addConnection(id, peer) {
    this.peerConnections[id] = peer;
  }
  getConnection(id) {
    let peer = this.peerConnections[id];
    return peer;
  }
  deleteConnection(id) {
    delete this.peerConnections[id];
  }
  stopConnection(id) {
    this.detachVideo();

    if (this.isConnectedWith(id)) {
      let peer = this.getConnection(id);
      peer.close();
      this.deleteConnection(id);
    }
  }

  sendSdp(id, sessionDescription) {
    console.log('---sending sdp ---');
    let data = { type: sessionDescription.type, sdp: sessionDescription.sdp };
    console.log('sending SDP=' + data);
    this.emitTo(id, data);
  }
  sendIceCandidate(id, candidate) {
    console.log('---sending ICE candidate ---');
    let obj = { type: 'candidate', ice: candidate };
    if (this.isConnectedWith(id)) {
      this.emitTo(id, obj);
    }
    else {
      console.warn('connection NOT EXIST or ALREADY CLOSED. so skip candidate')
    }
  }
  prepareNewConnection(id) {
    let peer = new RTCPeerConnection({"iceServers": []});

    // --- on get remote stream ---
    peer.ontrack = (event) => {
      let stream = event.streams[0];
      console.log('-- peer.ontrack() stream.id=' + stream.id);
      this.attachVideo(id, stream);
    };

    // --- on get local ICE candidate
    peer.onicecandidate = (evt) => {
      if (evt.candidate) {
        console.log(evt.candidate);
        this.sendIceCandidate(id, evt.candidate);
      } else {
        console.log('empty ice event');
        console.log(this.peerConnections);
      }
    };

    // --- when need to exchange SDP ---
    peer.onnegotiationneeded = (evt) => {
      console.log('-- onnegotiationneeded() ---');
    };

    // --- other events ----
    peer.onicecandidateerror = (evt) => {
      console.error('ICE candidate ERROR:', evt);
    };

    peer.onsignalingstatechange = () => {
      console.log('== signaling status=' + peer.signalingState);
    };

    peer.oniceconnectionstatechange = () => {
      console.log('== ice connection status=' + peer.iceConnectionState);
      if (peer.iceConnectionState === 'disconnected') {
        console.log('-- disconnected --');
        //hangupVideo();
        //???this.stopConnection(id);
      }
    };

    peer.onicegatheringstatechange = () => {
      console.log('==***== ice gathering state=' + peer.iceGatheringState);
    };

    peer.onconnectionstatechange = () => {
      console.log('==***== connection state=' + peer.connectionState);
    };

    peer.onremovestream = (event) => {
      console.log('-- peer.onremovestream()');
      this.detachVideo();
    };


    // -- add local stream --
    if (this.localStream) {
      console.log('Adding local stream...');
      let stream = this.localStream;
      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
        console.log(track)
      });
    }
    else {
      console.warn('no local stream, but continue.');
    }

    return peer;
  }
  makeOffer(id) {
    let peerConnection = this.prepareNewConnection(id);
    this.addConnection(id, peerConnection);
    peerConnection.createOffer()
    .then((sessionDescription) => {
      console.log('createOffer() succsess in promise');
      return peerConnection.setLocalDescription(sessionDescription);
    }).then(() =>  {
      console.log('setLocalDescription() succsess in promise');
      this.sendSdp(id, peerConnection.localDescription);
    }).catch((err) => {
      console.error(err);
    });
  }
  setOffer(id, sessionDescription) {
    let peerConnection = this.prepareNewConnection(id);
    this.addConnection(id, peerConnection);

    peerConnection.setRemoteDescription(sessionDescription)
    .then(() => {
      console.log('setRemoteDescription(offer) succsess in promise');
      this.makeAnswer(id);
    }).catch((err) => {
      console.error('setRemoteDescription(offer) ERROR: ', err);
    });
  }
  makeAnswer(id) {
    console.log('sending Answer. Creating remote session description...' );
    let peerConnection = this.getConnection(id);
    if (! peerConnection) {
      console.error('peerConnection NOT exist!');
      return;
    }

    peerConnection.createAnswer()
    .then((sessionDescription) => {
      console.log('createAnswer() succsess in promise');
      return peerConnection.setLocalDescription(sessionDescription);
    }).then(() => {
      console.log('setLocalDescription() succsess in promise');

      // -- Trickle ICE の場合は、初期SDPを相手に送る --
      this.sendSdp(id, peerConnection.localDescription);

      // -- Vanilla ICE の場合には、まだSDPは送らない --
    }).catch((err) => {
      console.error(err);
    });
  }
  setAnswer(id, sessionDescription) {
    let peerConnection = this.getConnection(id);
    if (! peerConnection) {
      console.error('peerConnection NOT exist!');
      return;
    }

    peerConnection.setRemoteDescription(sessionDescription)
    .then(() => {
      console.log('setRemoteDescription(answer) succsess in promise');
    }).catch((err) => {
      console.error('setRemoteDescription(answer) ERROR: ', err);
    });
  }
  addIceCandidate(id, candidate) {
    if (! this.isConnectedWith(id)) {
      console.warn('NOT CONNEDTED or ALREADY CLOSED with id=' + id + ', so ignore candidate');
      return;
    }

    let peerConnection = this.getConnection(id);
    if (peerConnection) {
      peerConnection.addIceCandidate(candidate);
    }
    else {
      console.error('PeerConnection not exist!');
      return;
    }
  }

  // --- video operation ---
  attachVideo(id, stream) {
    console.log('attached!');
    let video = document.getElementById('video');
    video.srcObject = stream;
    video.volume = 0.5;
  }
  detachVideo() {
    console.log('detached!');
    let video = document.getElementById('video');
    video.pause();
    if('srcObject' in video) {
      video.srcObject = null;
    }
    else {
      if(video.src && (video.src !== '')) {
        window.URL.revokeObjectURL(video.src);
      }
      video.src = '';
    }
  }
  async startVideo(type) {
    let video = await document.getElementById('video');
    navigator.getUserMedia = await navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
    switch(type) {
      case "selfy":
        navigator.getUserMedia({video: true, audio: true},
          (stream) => {
            this.localStream = stream;
            video.srcObject = stream;
          },
          (err) => {
            console.log(err);
          }
        );
        break;
      case "screen":
        navigator.getUserMedia({video: {mediaSource: "screen"}},
          (stream) => {
            this.localStream = stream;
            video.srcObject = stream;
          },
          (err) => {
            console.log(err);
          }
        );
        break;
      default:
        break;
    }
  }
  async stopVideo() {
    let tracks = this.localStream.getTracks();
    if (! tracks) {
      console.warn('NO tracks');
      return;
    }

    for (let track of tracks) {
      track.stop();
    }
    this.localStream = null;
  }
  connectVideo() {
    if (! this.canConnectMore()) {
      console.log('TOO MANY connections');
    }
    else {
      this.emitBroadcast({type: 'call'});
    }
  }
  hangupVideo() {
    console.log(this.peerConnections);
    for (let id in this.peerConnections) {
      this.stopConnection(id);
    }
    this.emitBroadcast({type: 'end'});
    this.stopVideo();
  }

  componentWillUnmount() {
    // if(this.props.isPerformer){
    //   Swal.fire({
    //     text: '本当にこのライブを終了しますか？',
    //     type: 'warning',
    //     showCancelButton: true,
    //     confirmButtonColor: '#3085d6',
    //     cancelButtonColor: '#d33',
    //     confirmButtonText: 'Yes'
    //   }).then((result) => {
    //     if (result.value) {
    //       this.socket.emit('CLOSE_LIVE', this.props.channel);
    //       this.socket.close();
    //       this.props.exitLive();
    //       this.props.history.push('/');
    //     }
    //     else {
    //       this.props.history.push('/board');
    //     }
    //   })
    // }
    if(this.props.onSelfy || this.props.onScreen){
      this.hangupVideo()
    }
    this.socket.close();
    this.props.exitLive();
    this.props.history.push('/');
  }

  render() {
    const {
      classes,
      title,
      channel,
      name,
      voices,
      members,
      myvoice,
      isPerformer,
      isOpenMemberList,
      isOpenController,
      onSelfy,
      onScreen,
      onSpeaker,
      onVoice,
      videoVolume,
      videoZoom,
      onChange,
      emitVoice,
      toggleController,
      toggleSettings,
      changeVolume,
      changeZoom,
      clickMemberList,
      clickAwayMemberList,
    } = this.props;

    return (
      <div className={classes.container} id={"liveSpace"}>
        <BoardTopbar
          classes={classes}
          title={title}
          channel={channel}
          clickLogo={toggleController}
          clickMike={clickMemberList}
          clickAway={clickAwayMemberList}
          open={isOpenMemberList}
          members={members}
        />
        <BoardController
          classes={classes}
          isPerformer={isPerformer}
          open={isOpenController}
          closeController={toggleController}
          toggleSettings={toggleSettings}
          onSelfy={onSelfy}
          onScreen={onScreen}
          onSpeaker={onSpeaker}
          onVoice={onVoice}
          startSelfy={() => this.startVideo("selfy").then(() => {this.emitBroadcast({type: 'cast'})})}
          startScreen={() => this.startVideo("screen").then(() => {this.emitBroadcast({type: 'cast'})})}
          stopVideo={() => this.hangupVideo()}
          videoVolume={videoVolume}
          videoZoom={videoZoom}
          changeVolume={changeVolume}
          changeZoom={changeZoom}
        />
        <div className={classes.live_content}>
          <video style={{MozTransform:`scale(${videoZoom})`,WebkitTransform:`scale(${videoZoom})`,MsTransform:`scale(${videoZoom})`,Transform:`scale(${videoZoom})`}} id="video" autoplay="1" className={classes.display}></video>
          {onVoice?
            onSelfy || onScreen?
              <VoiceList classes={classes} voices={voices} socket={this.socket} />
              :
              <VoiceChat classes={classes} voices={voices} socket={this.socket} />
            :
            null
          }
        </div>
        <BoardForm
          classes={classes}
          channel={channel}
          name={name}
          onVoice={onVoice}
          myvoice={myvoice}
          sendPress={emitVoice}
          socket={this.socket}
          onChange={onChange}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  title: state.title,
  channel: state.channel,
  name: state.name,
  isPerformer: state.isPerformer,
  members: state.members,
  myvoice: state.myvoice,
  voices: state.voices,
  isOpenMemberList: state.isOpenMemberList,
  isOpenController: state.isOpenController,
  onSelfy: state.onSelfy,
  onScreen: state.onScreen,
  onSpeaker: state.onSpeaker,
  onVoice: state.onVoice,
  videoVolume: state.videoVolume,
  videoZoom: state.videoZoom
});

const mapDispatchToProps = dispatch => ({
  onChange: value => dispatch(inputVoice(value)),
  receiveLiveInfo: data => dispatch(receiveLiveInfo(data)),
  emitVoice: data => dispatch(emitVoice(data)),
  toggleController: () => dispatch(toggleController()),
  toggleSettings: setting => dispatch(toggleSettings(setting)),
  changeVolume: volume => dispatch(changeVolume(volume)),
  changeZoom: scale => dispatch(changeZoom(scale)),
  clickMemberList: () => dispatch(clickMemberList()),
  clickAwayMemberList: () => dispatch(clickAwayMemberList()),
  receiveVoice: data => dispatch(receiveVoice(data)),
  exitLive: () => dispatch(exitLive())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Board)));

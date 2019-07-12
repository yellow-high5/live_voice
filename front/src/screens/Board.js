import React from "react";
import { connect } from "react-redux";

import { receiveLiveInfo, inputVoice, receiveVoice, emitVoice, toggleController, clickMemberList, clickAwayMemberList, exitLive } from "../actions";

import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";

import { BoardTopbar } from "./components/BoardTopbar";
import { BoardController } from "./components/BoardController";
import { BoardForm } from "./components/BoardForm";
import BoardMessage from "./components/BoardMessage";

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
  paper_list: {
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
  paper_list_item: {
    padding: 3,
  },
  paper_list_typo: {
    marginLeft: 5,
  },
  display: {
    position: "fixed",
    width: "100vw",
    height: "calc(100vh - 144px)",
  },
  board_message: {
    position: "relative"
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
});

//ロゴ、バッジ(人数表示)、タイトル、チャンネルコード、投稿フォーム、ボタン(画像、リンク)、スタンプ
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
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.value) {
              this.detachVideo();
            }
          })
        }
        default:
          return;
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
    video.volume = 1.0;
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
        navigator.getUserMedia({video: { width: 1280, height: 720 }, audio: true},
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
        navigator.getUserMedia({video: {mediaSource: "screen"} },
          (stream) => {
            this.localStream = stream;
            video.srcObject = stream;
          },
          (err) => {
            console.log(err);
          }
        );
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
      isOpenController,
      isOpenMemberList,
      onChange,
      emitVoice,
      toggleController,
      clickMemberList,
      clickAwayMemberList,
    } = this.props;

    return (
      <div className={classes.container} id={"liveSpace"}>
        <BoardTopbar
          classes={classes}
          title={title}
          channel={channel}
          isPerformer={isPerformer}
          clickLogo={toggleController}
          clickMike={clickMemberList}
          clickAway={clickAwayMemberList}
          open={isOpenMemberList}
          members={members}
        />
        <BoardController
          classes={classes}
          open={isOpenController}
          closeController={toggleController}
        />
        <button type="button" onClick={() => this.connectVideo()}>start webrtc</button>
        <button type="button" onClick={() => this.hangupVideo()}>stop webrtc</button>
        <button type="button" onClick={() => this.startVideo("screen").then(() => {this.emitBroadcast({type: 'cast'})})}>share screen</button>
        <button type="button" onClick={() => this.startVideo("selfy").then(() => {this.emitBroadcast({type: 'cast'})})}>selfy</button>
        <video id="video" autoplay="1" className={classes.display}></video>
        <div className={classes.board_message}>
          {voices.map(voice => {
            return <BoardMessage voice={voice} />;
          })}
        </div>
        <BoardForm
          classes={classes}
          channel={channel}
          name={name}
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
  isOpenController: state.isOpenController,
  isOpenMemberList: state.isOpenMemberList
});

const mapDispatchToProps = dispatch => ({
  onChange: value => dispatch(inputVoice(value)),
  receiveLiveInfo: data => dispatch(receiveLiveInfo(data)),
  emitVoice: data => dispatch(emitVoice(data)),
  toggleController: () => dispatch(toggleController()),
  clickMemberList: () => dispatch(clickMemberList()),
  clickAwayMemberList: () => dispatch(clickAwayMemberList()),
  receiveVoice: data => dispatch(receiveVoice(data)),
  exitLive: () => dispatch(exitLive())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Board)));

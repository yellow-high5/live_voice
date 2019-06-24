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
    //ライブ情報を受信
    this.socket.on("RECEIVE_LIVE_INFO", function(data) {
      console.log(data);
      props.receiveLiveInfo(data);
    })
    //メッセージを受信・更新
    this.socket.on("RECEIVE_VOICE", function(data) {
      props.receiveVoice(data);
    });
    //チャンネルの終了を受信
    this.socket.on("CLOSE_LIVE", function() {
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
    //ライブ情報を更新(自分の参加を更新する)
    // this.socket.emit("CHANGE_LIVE_INFO", {
    //   type: "add_member",
    //   name: props.name
    // })
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

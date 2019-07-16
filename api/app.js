var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
//var http = require('http').Server(app);
var socket = require('socket.io');
var redisAdapter = require('socket.io-redis');
server = app.listen(8080, function(){
    console.log('server is running on port 8080')
});

var faker = require('faker')

io = socket(server);
//io.adapter(redisAdapter({ host: 'live_voice_db', port: 6379 }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//connect mongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://live_voice_db:27017/live_voice');
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var Live = require('./models/Live')
var Member = require('./models/Member')
var Voice = require('./models/Voice')

//ライブ・チャンネル開設
app.post('/new_channel', function(req, res, next) {
  let title = req.query.title
  let name = req.query.name
  //ランダムなチャンネルでライブを作成する
  let random_name = `${faker.random.word(1).toLowerCase()}_${faker.random.number()}`
  let new_live = new Live({channel: random_name, title: title})
  new_live.save((err, live) => {
    if(err) {
      return next(err);
    }
    startLive(live)
    res.json(live)
  });
});

//チャンネルへのアクセス
app.get('/check_channel', function(req, res, next) {
  let channel = req.query.channel
  let name = req.query.name
  //チャンネルを検索
  Live.findOne({channel: channel}).populate('voices').exec((err, live) => {
    if(!live) {
      let err = new Error("Not find your channel");
      err.status = 401;
      return next(err);
    }
    res.json(live)
  })
});


//ライブごとに名前空間で分割する
function startLive(live){
  let nsp = io.of(`/${live.channel}`);
  //ライブに接続があったとき
  nsp.on('connection',
  (socket) => {
    // 接続確立(ライブ参加者をDBに生成)
    let new_member = new Member({name: socket.handshake.query.name, socket: socket.id})
    new_member.save(async (err, member) => {
      if(err) {
        console.log(err);//fix point(エラーの投げ方どないする？)
      }
      //パフォーマの接続の場合
      if(live.performer === null) {
        await live.definePerformer(member.id);//ライブのパフォーマーを定義
      }

      //クライアントの数を表示する(確認用)
      await nsp.clients((err, clients) => {
        console.log(`${nsp.name} user number:${clients.length}`)
        Member.find({'socket': clients}, (err, members) => {
          nsp.emit('RECEIVE_LIVE_INFO', members);
        })
      });
    })

    //クライアントからのボイスを受信したとき
    socket.on('SEND_VOICE', function(data){
      const {
        channel,
        content,
        emitter,
        position_x,
        position_y,
        socket,
        timestamp,
      } = data
      console.log(data)
      let new_voice = new Voice({content: content, emitter: emitter, position_x: position_x, position_y: position_y, socket: socket, timestamp: timestamp});
      new_voice.save((err, voice) => {
        if(!voice) {
          return next(err);
        }
        Live.findOne({channel: channel}).then((live) => {
          if(!live) {
            let err = new Error("This Live has error");
            err.status = 401;
            return next(err);
          }
          live.addVoice(voice._id)

          nsp.emit('RECEIVE_VOICE', data);
        })
      });
    });

    //クライアントからのシグナリングを受信したとき
    socket.on('signaling', function (data) {
      data.from = socket.id;
      let target = data.to
      console.log(data)
      if (target) {
        nsp.to(target).emit('signaling', data);
        return;
      }
      nsp.emit('signaling', data);
    });

    //ライブへの接続が切れたクライアントがいたとき
    socket.on('disconnect', (reason) => {
      Member.findOne({socket: socket.id}).then((member) => {
        if(!member) {
          console.log('ERROR');
        }
        //パフォーマーだったら
        if(live.performer.equals(member.id)){
          nsp.emit('CLOSE_LIVE');
          //ライブを削除
          Live.findOneAndRemove({ channel: live.channel }, (err, live) => {
            if (err) {
              console.log('ERROR');
              return
            }
          });
        }
        socket.disconnect();
        nsp.clients((err, clients) => {
          console.log(`${nsp.name} user number:${clients.length}`)
          Member.find({'socket': clients}, (err, members) => {
            nsp.emit('RECEIVE_LIVE_INFO', members);
          })
        });

      })
    });

  });

}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;

Live Voice on Docker
===

![screenshot_launch](https://user-images.githubusercontent.com/14067398/71407700-24e65b80-267f-11ea-95ae-31171b87a769.png)

## Description
Live Voice is real time chat application composed up of two great JS frameworks: React and Express. The source code is assumed to run on Docker.  
For the text-based chat, a library called [socket.io](https://socket.io/)that implements the websocket protocol is used, and for the video-based chat, an [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) is used.   
Live Voice may not work because the WebRtc specification is incomplete, but if I have time, I will actively correct it.  

![screenshot_demo](https://user-images.githubusercontent.com/14067398/71407738-3def0c80-267f-11ea-8fb7-af6c6f509b3d.png)

## Demo
Let's Play↓</br>
https://live-voice-react.herokuapp.com/

I recommend that you use Firefox or Chrome as possible.   
c.f. My browser is Firefox Developer Edition 71.0b12, Google Chrome 78.0.3904.108  
The deployed Heroku server is sometimes resting, so don't feel bad if your connection is slow.  

## Install

```sh
$ git clone https://github.com/yellow-high5/live_voice.git
$ cd live_voice
$ docker-compose up -d
```

## Licence

[MIT](https://opensource.org/licenses/MIT)
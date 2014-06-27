var PhoneRTCMediaHandler = function(session, options) {
  var events = [
  ];
  options = options || {};

  this.logger = session.ua.getLogger('sip.invitecontext.mediahandler', session.id);
  this.session = session;
  this.ready = true;
  this.audioMuted = false;
  this.videoMuted = false;

  // old init() from here on
  var idx, length, server,
    servers = [],
    stunServers = options.stunServers || null,
    turnServers = options.turnServers || null,
    config = this.session.ua.configuration;
  this.RTCConstraints = options.RTCConstraints || {};

  if (!stunServers) {
    stunServers = config.stunServers;
  }

  if(!turnServers) {
    turnServers = config.turnServers;
  }

  /* Change 'url' to 'urls' whenever this issue is solved:
   * https://code.google.com/p/webrtc/issues/detail?id=2096
   */
  servers.push({'url': stunServers});

  length = turnServers.length;
  for (idx = 0; idx < length; idx++) {
    server = turnServers[idx];
    servers.push({
      'url': server.urls,
      'username': server.username,
      'credential': server.password
    });
  }

  this.initEvents(events);

  this.phonertc = {};
};

PhoneRTCMediaHandler.prototype = Object.create(SIP.MediaHandler.prototype, {
// Functions the session can use
  isReady: {writable: true, value: function isReady () {
    return this.ready;
  }},

  close: {writable: true, value: function close () {
    this.logger.log('calling phonertc.disconnect()');
    cordova.plugins.phonertc.disconnect();
  }},

  /**
   * @param {Function} onSuccess
   * @param {Function} onFailure
   * @param {SIP.WebRTC.MediaStream | (getUserMedia constraints)} [mediaHint]
   *        the MediaStream (or the constraints describing it) to be used for the session
   */
  getDescription: {writable: true, value: function getDescription (onSuccess, onFailure, mediaHint) {
                    onFailure = onFailure;
                    mediaHint = mediaHint;
    if (!this.phonertc.role) {
      this.phonertcCall('caller');
    }

    var pcDelay = 5000;
    setTimeout(function () {
      var sdp = this.phonertc.localSdp;
      if (this.phonertc.role !== 'caller') {
        sdp = sdp.replace('a=setup:actpass', 'a=setup:passive');
      }
      sdp = sdp.replace(/a=crypto.*\r\n/g, '');
      onSuccess(sdp);
    }.bind(this), pcDelay);
  }},

  phonertcSendMessageCallback: {writable: true, value: function phonertcSendMessageCallback (data) {
    this.logger.log("XXX phonertcSendMessageCallback: " + JSON.stringify(data, null, 2));
    if (['offer', 'answer'].indexOf(data.type) > -1) {
      this.phonertc.localSdp = data.sdp;
    }
    else if (data.type === 'candidate') {
      // Video comes before audio
      if (this.phonertc.localSdp.indexOf('m=video') < this.phonertc.localSdp.indexOf('m=audio')) {
        if (data.id === 'video') {
          this.phonertc.localSdp = this.phonertc.localSdp.replace(/m=audio.*/,data.candidate+"$&");
        } else {
          this.phonertc.localSdp += data.candidate;
        }
      } else {
        if(data.id === 'audio') {
          this.phonertc.localSdp = this.phonertc.localSdp.replace(/m=video.*/,data.candidate+"$&");
        } else {
          this.phonertc.localSdp += data.candidate;
        }
      }
    }
  }},

  phonertcCall: {writable: true, value: function phonertcCall (role) {
    this.logger.log("XXX phonertcCall: " + role);
    this.phonertc.role = role;
    cordova.plugins.phonertc.call({
      isInitator: role === 'caller', // Caller or callee?
      turn: {
        host: 'turn:turn.example.com:3478',
        username: 'user',
        password: 'pass'
      },
      sendMessageCallback: this.phonertcSendMessageCallback.bind(this),
      answerCallback: function () {
        window.alert('Callee answered!');
      },
      disconnectCallback: function () {
        window.alert('Call disconnected!');
      },
      video: {
        localVideo: document.querySelector('#localVideo'),
        remoteVideo: document.querySelector('#remoteVideo')
      }
    });
  }},

  /**
  * Message reception.
  * @param {String} type
  * @param {String} sdp
  * @param {Function} onSuccess
  * @param {Function} onFailure
  */
  setDescription: {writable: true, value: function setDescription (sdp, onSuccess, onFailure) {
    function setRemoteDescription (type, sdp) {
      this.logger.log("XXX setRemoteDescription: " + type + "\n" + sdp);
      cordova.plugins.phonertc.receiveMessage({type: type, sdp: sdp});
      onSuccess();
    }

    if (!this.phonertc.role) {
      this.phonertcCall('callee');
      var pcDelay = 5000;
      setTimeout(setRemoteDescription.bind(this, 'offer', sdp), pcDelay);
    }
    else if (this.phonertc.role = 'caller') {
      setRemoteDescription.call(this, 'answer', sdp);
    }
    else {
      this.logger.error('XXX setDescription called, but this.phonertc.role = ' + this.phonertc.role);
      onFailure();
    }
  }},

// Functions the session can use, but only because it's convenient for the application
  mute: {writable: true, value: function mute (options) {
          options = options;
  }},

  unmute: {writable: true, value: function unmute (options) {
            options = options;
  }},
});

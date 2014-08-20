/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    var SIP = cordova.require('com.onsip.sipjs.sipjs');
    var PhoneRTCMediaHandler = cordova.require('com.dooble.phonertc.PhoneRTC');

    app.receivedEvent('deviceready');
    window.addEventListener("orientationchange", cordova.plugins.phonertc.updateVideoPosition);

    var $ = document.querySelector.bind(document);

    window.ua = new SIP.UA({
      traceSip: true,
      mediaHandlerFactory: PhoneRTCMediaHandler
    });

    window.ua.on('invite', makeCall);

    function eatEvent (listener) {
      return function (e) {
        listener.apply(this, [].slice.call(arguments, 1));

        // adapted from http://stackoverflow.com/a/5150556
        if (e.preventDefault) {
           e.preventDefault();
        }
        e.returnValue = false; // for IE
        return false;
      }.bind(this);
    }

    function makeCall (session) {
      if (window.session) {
        alert('only one call at a time');
        return;
      }

      var options = {
        media: {
          constraints: {
            audio: true,
            video: $('#useVideo').checked
          },
          render: {
            local: {
              video: $('#localVideo')
            },
            remote: {
              video: $('#remoteVideo')
            }
          }
        }
      };

      if (session) {
        session.accept(options);
        window.session = session;
      }
      else {
        window.session = window.ua.invite($('#target').value, options);
      }

      setupEventListeners(null, window.session);
    }

    function setupEventListeners (request, session) {
      session.on('refer', session.followRefer(setupEventListeners));
      session.on('terminated', function () {window.session = null;});
    }


    function onHangup () {
      if (window.session) {
        window.session.terminate();
        window.session = null;
      }
    }

    $('#phone').addEventListener('submit', eatEvent(makeCall), false);
    $('#hangup').addEventListener('click', onHangup, false);
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  }
};

sipjs-cordova
=============

A proof-of-concept Cordova app that uses [SIP.js](http://sipjs.com/) with the [PhoneRTC plugin](https://github.com/alongubkin/phonertc) to make WebRTC calls over the internet.

Installation
-

```bash
git clone https://github.com/joseph-onsip/sipjs-cordova.git &&
cd sipjs-cordova/ &&
#plug in your Android and set it up for debugging
make android && #or make ios
make
```

Usage
-

You can use this app to call [SIP addresses](https://en.wikipedia.org/wiki/SIP_address). If you don't have a SIP address, the easiest way to try this out is as follows:

1. Get a free SIP address from [GetOnSIP](https://www.getonsip.com)
2. [Log in](https://www.getonsip.com/webrtc/) to the GetOnSIP phone.
3. Enter your SIP address into the sipjs-cordova app and press `Call`

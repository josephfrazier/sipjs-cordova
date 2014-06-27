test: build
	cordova run
	adb logcat

build: plugin sip
	cordova build

plugin:
	-cordova plugin remove com.dooble.phonertc
	cordova plugin add phonertc

sip:
	cd sip.js && npm install && grunt build && cp dist/sip.js ../www/js/sip.js

init:
	mkdir -p platforms plugins merges
	git submodule update --init
	-cordova platform add android

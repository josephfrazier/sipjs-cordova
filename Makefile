test: plugin build
	cordova build
	make run

run:
	cordova run
	adb logcat

plugin:
	-cordova plugin remove com.dooble.phonertc
	cordova plugin add phonertc
	-cordova plugin remove com.sipjs.phonertc
	cordova plugin add src/js/PhoneRTCMediaHandler

build:
	npm test

init:
	npm install
	mkdir -p platforms plugins merges
	git submodule update --init
	-cordova platform add android
	cordova plugin add com.onsip.sipjs

debug: plugin
	ant -verbose debug -f "platforms/android/build.xml"

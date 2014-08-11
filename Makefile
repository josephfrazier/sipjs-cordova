build: plugin build
	cordova build
	make run

run:
	cordova run --device
	ls platforms | grep android && adb logcat

plugin:
	-cordova plugin remove com.dooble.phonertc
	cordova plugin add phonertc
	-cordova plugin remove com.sipjs.phonertc
	cordova plugin add src/js/PhoneRTCMediaHandler

init:
	npm install
	mkdir -p platforms plugins merges
	git submodule update --init
	cordova plugin add com.onsip.sipjs

android:
	make init
	-cordova platform add android

ios:
	make init
	-cordova platform add ios
	cp -f ios_build platforms/ios/cordova/build

debug: plugin
	ant -verbose debug -f "platforms/android/build.xml"

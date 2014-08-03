test: plugin build
	cordova build
	make run

run:
	cordova run
	adb logcat

plugin:
	-cordova plugin remove com.dooble.phonertc
	cordova plugin add phonertc

build:
	npm test

init:
	npm install
	mkdir -p platforms plugins merges
	git submodule update --init
	-cordova platform add android

debug: plugin
	ant -verbose debug -f "platforms/android/build.xml"

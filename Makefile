master: init
	cd phonertc && git checkout 182a70725e54437f10021b17f2e6d242bab47b29
	-cordova plugin remove com.dooble.phonertc
	cordova plugin add phonertc
	cordova build
	cordova run

working: init
	cd phonertc && git checkout 60a6cc7a4bf2d33ee40bfd8527f8d87f3f58cc97
	-cordova plugin remove com.dooble.phonertc
	cordova plugin add phonertc
	cordova build
	cordova run

init:
	-mkdir platforms plugins merges
	git submodule update --init
	-cordova platform add android

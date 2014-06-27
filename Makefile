master: init
	cd phonertc && git checkout 182a70725e54437f10021b17f2e6d242bab47b29
	-cordova plugin remove com.dooble.phonertc
	cordova plugin add phonertc
	cordova build
	cordova run

working: init
	cd phonertc && git checkout 6965b7ae1b5909b59df9f85d5bdbdf3f2ba88b56
	-cordova plugin remove com.dooble.phonertc
	cordova plugin add phonertc
	cordova build
	cordova run

init:
	-mkdir platforms plugins merges
	git submodule update --init
	-cordova platform add android

/*
loader.js
variable app is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of
the bubbles game will be properties of app.
*/
"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// CONSTANTS of app
app.KEYBOARD = {
	"KEY_LEFT": 37,
	"KEY_UP": 38,
	"KEY_RIGHT": 39,
	"KEY_DOWN": 40,
	"KEY_SPACE": 32
};

// properties of app
app.animationID = undefined;
app.paused = false;

// key daemon array
app.keydown = [];

(function(){
	var queue = new createjs.LoadQueue(false);
	queue.on("fileload", handleFileLoad, this);
	queue.on("complete", complete, this);
	queue.loadFile("js/lib/three.min.js");
	queue.loadFile("js/lib/FirstPersonControls.js");
	queue.loadFile("js/lib/tween.js");
	queue.loadFile("js/carnival.js");
	queue.loadFile("js/skytween.js");


	function handleFileLoad(e){
		//console.log(e + " loaded");
	}

	function handleComplete(e){
		app.carnival.init();
	}

	// when the loading is complete, this function will be called
	 function complete(){

		var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
		var FOV = 45, ASPECT = SCREEN_WIDTH/SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;

		// set up event handlers
		window.onblur = function(){
			app.paused = true;
			cancelAnimationFrame(app.animationID);
			app.keydown = []; // clear key daemon
			// call update() so that our paused screen gets drawn
			app.carnival.update();
		};

		window.onfocus = function(){
			app.paused = false;
			cancelAnimationFrame(app.animationID);
			// start the animation back up
			app.carnival.update();
		};

		// event listeners
		window.addEventListener("keydown",function(e){
			console.log("keydown=" + e.keyCode);
			app.keydown[e.keyCode] = true;
		});

		window.addEventListener("keyup",function(e){
			console.log("keyup=" + e.keyCode);
			app.keydown[e.keyCode] = false;
		});

		window.addEventListener('resize',function(e)
		{
			app.carnival.renderer.setSize( window.innerWidth, window.innerHeight );
			// update the camera
			app.carnival.camera.aspect	= window.innerWidth / window.innerHeight;
			app.carnival.camera.updateProjectionMatrix();
		});


		// start game
		app.carnival.init(FOV,SCREEN_HEIGHT,SCREEN_WIDTH,ASPECT,NEAR,FAR);
	} // end complete

}());

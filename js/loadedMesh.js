"use strict";
var app = app || {};

app.LoadedMesh = function()
{
	function LoadedMesh()
	{
		// texture
		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {

			console.log( item, loaded, total );

		};

		var texture = new THREE.Texture();

		var loader = new THREE.ImageLoader( manager );
		loader.load( 'textures/grass.jpg', function ( image ) {

			texture.image = image;
			texture.needsUpdate = true;

		} );

		// model
		var loader = new THREE.OBJLoader( manager );
		loader.load( 'models/male02.obj', function ( object ) {

			object.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {

					child.material.map = texture;

				}

			} );

			object.position.y = - 80;
			console.log(object);
			
			//debugger;

		} );

	};
	
	var p = LoadedMesh.prototype;
	
	// functions
	
	return LoadedMesh;
}();


/*"use strict";
var app = app || {};

app.LoadedMesh = function()
{
	function LoadedMesh(posX, posY, width, height, color, text, textSize)
	{
		// constructor
		
		
		var container, stats;

		var camera, scene, renderer;

		this.mouseX = 0;
		this.mouseY = 0;

		this.windowHalfX = window.innerWidth / 2;
		this.windowHalfY = window.innerHeight / 2;
		
		
	
		
		this.texture = new THREE.Texture();
		this.mesh = undefined;
		
		//this.init();

		//init();
		//animate();

		
	};
	
	var p = LoadedMesh.prototype;

	p.init = function() {
	
		console.log("mesh init");
		
		// texture
		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {

			console.log( item, loaded, total );

		};

		var loader = new THREE.ImageLoader( manager );
		loader.load( '../textures/grass.jpg', function ( image ) {

			console.log("loading");
			texture.image = image;
			texture.needsUpdate = true;

		} );

		// model
		var loader = new THREE.OBJLoader( manager );
		loader.load( '../models/male02.obj', function ( object ) {

			object.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {

					child.material.map = texture;

				}

			} );

			//debugger;
			object.position.y = - 80;
			debugger;
			console.log(object);
			//scene.add( object );

		},
		function()
		{
		console.log("progress");
		},
		function()
		{
		console.log("error!");
		}
		);
		
		console.log("done");
	};

	/*
	function onWindowResize() {
	/
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function onDocumentMouseMove( event ) {

		mouseX = ( event.clientX - windowHalfX ) / 2;
		mouseY = ( event.clientY - windowHalfY ) / 2;

	}

	//

	function animate() {

		requestAnimationFrame( animate );
		render();

	}

	function render() {

		camera.position.x += ( mouseX - camera.position.x ) * .05;
		camera.position.y += ( - mouseY - camera.position.y ) * .05;

		camera.lookAt( scene.position );

		renderer.render( scene, camera );

	}
	
	
	return LoadedMesh;
}();*/
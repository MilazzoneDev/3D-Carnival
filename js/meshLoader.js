"use strict";
var app = app || {};

app.MeshLoader = {

	// Buffer for storing the loaded data
	meshBuffer : undefined,

	loadMesh: function(texURL, meshURL, destination)
	{
		// texture
		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {

			console.log( item, loaded, total );

		};

		var texture = new THREE.Texture();

		var loader = new THREE.ImageLoader( manager );
		loader.load( texURL, function ( image ) {

			texture.image = image;
			texture.needsUpdate = true;

		} );
		
		// model
		var loader = new THREE.OBJLoader( manager );
		loader.load( meshURL, function ( object ) {

			object.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {
					child.material.map = texture;
				}

			} );

			object.position.y = - 80;
			destination = object;
			app.carnival.scene.add(destination);
		} );
	} // end function

};
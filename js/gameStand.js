"use strict";
var app = app || {};

app.GameStand = {

	mesh: undefined,

	load: function(texURL, meshURL)
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

			//object.material.map = texture;
			object.rotation.y= Math.PI;
			object.position.y = 35;
			object.position.x = -500;
			object.position.z = -500;
			object.scale.set(20, 20, 20);
			app.GameStand.mesh = object;

			app.carnival.scene.add(app.GameStand.mesh);
		} );
	}, // end function

/*
	update: function()
	{
		if(this.mesh)
		{
			this.mesh.position.x++;
		}

	}
	*/

};

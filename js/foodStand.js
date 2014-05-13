"use strict";
var app = app || {};

// using:
// https://cdn.tutsplus.com/psd/uploads/legacy/0495_Wood_Textures/03-free-wood-textures.jpg
//
app.FoodStand = {

	object: undefined,
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
					app.FoodStand.mesh = child;
				}

			} );

			object.position.y = 15;
			object.position.x = -300;
			object.position.z = -500;
			object.scale.set(20, 20, 20);
			app.FoodStand.object = object;

			app.carnival.scene.add(app.FoodStand.object);
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

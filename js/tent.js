"use strict";
var app = app || {};

// using:
// http://www.turbosquid.com/3d-models/tent-max-free/660727
app.Tent = {

	mesh: undefined,

	load: function(texURL, meshURL)
	{
		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {
			console.log( item, loaded, total );
		};

		var loader = new THREE.OBJLoader( manager );
		loader.load( meshURL, function ( object ) {

			object.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {
					child.material = new THREE.MeshPhongMaterial({color: 0xA89441});
				}
			} );

			object.rotation.x= -Math.PI/2;
			object.rotation.z= -Math.PI/4;
			object.position.y = -15;
			object.position.x = 200;
			object.position.z = -500;
			app.Tent.mesh = object;

			app.carnival.scene.add(app.Tent.mesh);
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

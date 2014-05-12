"use strict";
var app = app || {};

app.GameStand = {

	mesh: undefined,
	items: [],
	rows: 2,
	cols: 6,

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
		
		// load eggplants and caramels on the shelves
		for(var i=0; i<this.rows; i++)
		{
			for(var j=0; j<this.cols; j++)
			{
				// randomize whether it's an eggplant or caramel
				var rand = app.utilities.getRandom(0, 1);
				
				if(rand > 0.5)
				{
					// Caramel
					
				} else
				{
					// Eggplant
					var itemGeo = new THREE.SphereGeometry( 5, 32, 32 );
					var itemMat = new THREE.MeshPhongMaterial({color: 0xaa00ff, overdraw: true});
					var itemMesh = new THREE.Mesh(itemGeo, itemMat);
					
					itemMesh.position.y = 46 - 20 * i;
					itemMesh.position.x = -538 + 15 * j;
					itemMesh.position.z = -510;
						
					//items.addObject(itemMesh);
					app.carnival.scene.add(itemMesh);
				}
			}
		}
		
		
		
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

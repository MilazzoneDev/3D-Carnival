"use strict";
var app = app || {};

// using:
// https://cdn.tutsplus.com/psd/uploads/legacy/0495_Wood_Textures/03-free-wood-textures.jpg
//
app.FoodStand = {

	object: undefined,
	mesh: undefined,
	
	foodObject: undefined,
	foodObjectActive: false,

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
			
			// once the stand is done loading, load extras
			app.FoodStand.makeFoodItems();
		} );
		
	}, // end function
	
	makeFoodItems: function()
	{
	    var stickGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.3);
	    var stickMat = new THREE.MeshPhongMaterial({color: 0xBB8F00});
	    var stick = new THREE.Mesh(stickGeo, stickMat);
	
	    this.object.add(stick);
	    stick.position.x = 0.5;
	    stick.position.y = 0.5;
	    stick.position.z = 1.5;
	    
	    var cornDogMat = new THREE.MeshPhongMaterial({color: 0xBA7600});
	    var sphereGeo = new THREE.SphereGeometry(0.1);
	    var sphere1 = new THREE.Mesh(sphereGeo, cornDogMat);
	    var sphere2 = new THREE.Mesh(sphereGeo, cornDogMat);
	    
	    stick.add(sphere1);
	    stick.add(sphere2);
	    sphere1.position.y = 0.5;
	    sphere2.position.y = 0.25;
	    
	    var cylinderGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.25);
	    var cylinder = new THREE.Mesh(cylinderGeo, cornDogMat);
	    
	    stick.add(cylinder);
	    cylinder.position.y = 0.4;
	    
	    this.foodObject = stick;
	},
	
	
	doRaycast: function(raycaster) {
		var intersects = raycaster.intersectObjects([this.foodObject]);

		if (intersects.length > 0) {
			// Player clicked on corn dog
			if(intersects[0].object == this.foodObject && !this.foodObjectActive)
			{
				console.log("take corn dog");
			}
		}
	},

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

"use strict";

var app = app || {};

app.ferrisWheel = {

	angle: 0,
	speed: 0.003,
	Partitions: 15,
	PartitionLength: 250,
	PartitionThickness:15,
	BaseWidth: 100,
	BaseAngle: Math.PI/5,
	BaseLengthModifier: 9/8,
	LightChanger: 0,
	LightChanger2: 0,
	all:undefined,
	structure: undefined,
	lights: undefined,
	seats: undefined,
	base: undefined,
	camera: undefined,
	controls:undefined,

	active: false,
	keydown:false,

	initCamera: function( fov, aspect, near, far )
	{
		//create camera
		this.camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
		this.controls = new THREE.FirstPersonControls(this.camera);
		this.controls.movementSpeed = 0;
		this.controls.lookSpeed = 0.18;
		this.controls.autoForward = false;
	},

	init : function(speed)
	{
		if(speed)
		{
			this.speed = speed;
		}
		this.lights = [];

		//create structure
		this.structure = new THREE.Object3D();
		for(var i = 0; i< this.Partitions;i++)
		{
			var newAngle = (Math.PI*2/this.Partitions)*(i+0.5);
			var newAngle2 = (Math.PI*2/this.Partitions)*(i);

			for(var j = -1; j < 2; j=j+2)
			{
				var lookAt = new THREE.Vector3(0,0,0);
				//radial bars
				var structureG = new THREE.CylinderGeometry(this.PartitionThickness/4,this.PartitionThickness/4,this.PartitionLength,32);
				var structureM = new THREE.MeshPhongMaterial({color: 0xbbbbbb, overdraw: true});
				var structure = new THREE.Mesh(structureG,structureM)

				structure.position.x = ( (this.PartitionLength/2)*(Math.cos(newAngle)));
				structure.position.z = ( (this.PartitionLength/2)*(Math.sin(newAngle)));

				structure.lookAt(lookAt);


				structure.rotateOnAxis(new THREE.Vector3(0,0,1),Math.PI/2);
				structure.rotateOnAxis(new THREE.Vector3(1,0,0),Math.PI/2);

				structure.position.y = j*this.BaseWidth/3 - (j*this.PartitionThickness/4 + j*this.PartitionThickness/20);
				
				//add lights to radial bars
				var dist = this.PartitionLength/10;
				for(var k = -3; k < 3;k++)
				{
					//var light = new THREE.PointLight( 0xffff00, 1, 10 );
					//var boxm = new THREE.MeshPhongMaterial({color: 0xff0000, overdraw: true});
					//var boxg = new THREE.BoxGeometry(10,10,10);
					//light = new THREE.Mesh(boxg,boxm);
					//this.lights.push(light);
					//light.position.set( j*5,0,0 );
					var geometry = new THREE.SphereGeometry( 2, 32, 32 );
					var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
					var sphere = new THREE.Mesh( geometry, material );
					structure.add(sphere);
					sphere.position.set( j*5,k*dist,0 );
					console.log(sphere.position.y);
					this.lights.push(sphere);
				}	
				
				//end radial bars

				//inner bars
				var structureG2 = new THREE.CylinderGeometry(this.PartitionThickness/4,this.PartitionThickness/4,((this.PartitionLength*Math.PI)/this.Partitions)*3.45,32);
				//var structureM = new THREE.MeshBasicMaterial({color:0xaaffaa});
				var structureM2 = new THREE.MeshPhongMaterial({color: 0x44bbff, overdraw: true});
				var structure2 = new THREE.Mesh(structureG2,structureM2)

				structure2.position.x = ( (this.PartitionLength/2)*(Math.cos(newAngle2)));
				structure2.position.z = ( (this.PartitionLength/2)*(Math.sin(newAngle2)));

				structure2.lookAt(lookAt);

				structure2.rotateOnAxis(new THREE.Vector3(0,0,1),Math.PI/2);

				structure2.position.y = j*this.BaseWidth/3 - (j*this.PartitionThickness/4 + j*this.PartitionThickness/20);
				//end inner bars
				//outer bars
				var structureG3 = new THREE.CylinderGeometry(this.PartitionThickness/4,this.PartitionThickness/4,((this.PartitionLength*Math.PI*2)/this.Partitions),32);
				var structureM3 = new THREE.MeshPhongMaterial({color: 0xbbbbbb, overdraw: true, shininess: 30});
				//var structureM3 = new THREE.ParticleSystemMaterial({color: 0x9db3b5});
				var structure3 = new THREE.Mesh(structureG3,structureM3)

				structure3.position.x = ( (this.PartitionLength-this.PartitionThickness/4)*(Math.cos(newAngle2)));
				structure3.position.z = ( (this.PartitionLength-this.PartitionThickness/4)*(Math.sin(newAngle2)));

				structure3.lookAt(lookAt);

				structure3.rotateOnAxis(new THREE.Vector3(0,0,1),Math.PI/2);

				structure3.position.y = j*this.BaseWidth/3 - (j*this.PartitionThickness/4 + j*this.PartitionThickness/20);


				//end outer bars

				//sphere caps
				var sphereG = new THREE.SphereGeometry( this.PartitionThickness/4, 32, 32 );
				var sphere = new THREE.Mesh( sphereG, structureM );
				sphere.position.x = ( (this.PartitionLength)*(Math.cos(newAngle)));
				sphere.position.z = ( (this.PartitionLength)*(Math.sin(newAngle)));
				sphere.lookAt(lookAt);
				sphere.position.y = j*this.BaseWidth/3 - (j*this.PartitionThickness/4 + j*this.PartitionThickness/20);
				//end sphere caps

				//add all to structure
				this.structure.add(structure);
				this.structure.add(structure2);
				this.structure.add(structure3);
				this.structure.add(sphere);
			}


		}

		var structureG = new THREE.CylinderGeometry(this.PartitionThickness,this.PartitionThickness,this.BaseWidth,32);
		//var allM = new THREE.MeshBasicMaterial({color:0xaaaaaa});
		var structureM= new THREE.MeshPhongMaterial({color: 0xbbbbbb, overdraw: true});
		var structure = new THREE.Mesh(structureG,structureM);
		this.structure.add(structure);

		//create base
		this.base = new THREE.Object3D();
		for(var i = -1; i < 2; i= i+2)
		{
			for(var j = -1; j < 2; j= j+2)
			{
				var lookAt = new THREE.Vector3(0,0,0);
				var length = (this.PartitionLength*this.BaseLengthModifier)/Math.cos(this.BaseAngle);
				//console.log("ferrisWheel.y should be "+this.PartitionLength*this.BaseLengthModifier);
				//console.log("length "+length);
				//var length = this.PartitionLength*this.BaseLengthModifier;
				var baseG = new THREE.CylinderGeometry(this.PartitionThickness/3,this.PartitionThickness/3,length,32);
				var baseM = new THREE.MeshPhongMaterial({color: 0xbbbbbb, overdraw: true});
				var baseBar = new THREE.Mesh(baseG,baseM)

				baseBar.position.x = ( (length/2)*(Math.cos(this.BaseAngle*i+Math.PI)));
				baseBar.position.z = ( (length/2)*(Math.sin(this.BaseAngle*i+Math.PI)));
				
				baseBar.lookAt(lookAt);

				baseBar.rotateOnAxis(new THREE.Vector3(0,0,1),Math.PI/2);
				baseBar.rotateOnAxis(new THREE.Vector3(1,0,0),Math.PI/2);

				baseBar.position.y = j * this.BaseWidth/2 - (j * this.PartitionThickness/3 + j*this.PartitionThickness/20);
				
				this.base.add(baseBar);
			}
			
		}

		//create seats
		this.seats = new THREE.Object3D();
		for(var i = 0; i< this.Partitions;i++)
		{
			var newAngle = (Math.PI*2/this.Partitions)*(i+0.5);

			var structureG = new THREE.CubeGeometry(this.BaseWidth/3,this.BaseWidth/1.6-this.PartitionThickness,this.BaseWidth/3);
			//var structureM = new THREE.MeshBasicMaterial({color:0xaaffaa});
			var structureM = new THREE.MeshPhongMaterial({color: 0x9db3b5, overdraw: true});
			var seat = new THREE.Mesh(structureG,structureM)


			seat.position.x = ( (this.PartitionLength)*(Math.cos(newAngle)));
			seat.position.z = ( (this.PartitionLength)*(Math.sin(newAngle)));

			this.seats.add(seat);
		}


		//stand up the ferrisWheel
		this.structure.rotation = new THREE.Euler( 0, 0, Math.PI/2, 'XYZ' );
		this.seats.rotation = new THREE.Euler(0,0,Math.PI/2,'XYZ');
		this.base.rotation = new THREE.Euler(0,0,Math.PI/2,'XYZ');
		
		//add structure and seats to wheel
		this.all = new THREE.Object3D();
		this.all.add(this.structure);
		this.all.add(this.base);
		this.all.add(this.seats);
		this.all.add(this.camera);

	},

	Update : function()
	{
		if(this.structure.rotation.x > Math.PI*2)
		{
			this.resetWheel();
			console.log(this.structure.rotation.x);
		}
		if(app.keydown[72] && !this.keydown)
		{
			this.resetWheel();
		}
		if(app.keydown[72] != this.keydown)
		{
			this.keydown = app.keydown[72];
		}

		if(this.active)
		{
			this.structure.rotation.x += this.speed;

			this.seats.rotation.x += this.speed;

			var seatChildren = this.seats.children;
			for(var k = 0; k < seatChildren.length; k++)
			{
				seatChildren[k].rotation.y+=this.speed;
			}

			//this.controls.object.rotation.z+=Math.PI/2;

			this.camera.position.y = this.structure.position.x -( (this.PartitionLength)*(Math.cos(this.structure.rotation.x)));
			this.camera.position.z = this.structure.position.z -( (this.PartitionLength)*(Math.sin(this.structure.rotation.x)))-10;

		}
		
		//move lights
		var dist = this.PartitionLength/6;
		
		this.LightChanger2++;
		if(this.LightChanger2 > 50)
		{
			this.LightChanger2 = 0;
			this.LightChanger++;
			if(this.LightChanger > 6)
			{
				this.LightChanger = 0;
			}
			for(var i = 0; i < this.lights.count; i++)
			{
				//var structureChildren = this.structure.children;
				
				//.position.y = dist*this.LightChanger;
			}
		}
		//console.log(this.lights[0].position.y);
		
	},

	resetWheel : function()
	{
		this.active = !this.active;
		//this.controls.object.rotation = new THREE.Euler( Math.PI/2, 0, 0, 'XYZ' );
		this.camera.rotateOnAxis(new THREE.Vector3(0,1,0),Math.PI/2);
		this.controls.lon = 270;
		this.controls.lat = 0;

		this.structure.rotation.x = 0;
		this.seats.rotation.x = 0;
		var seatChildren = this.seats.children;
		for(var k = 0; k < seatChildren.length; k++)
		{
			seatChildren[k].rotation.y= 0;
		}
	}
};

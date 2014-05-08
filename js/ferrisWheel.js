"use strict";

var app = app || {};

app.ferrisWheel = {

	angle: 0,
	Partitions: 15,
	PartitionLength: 200,
	PartitionThickness:20,
	BaseWidth: 45,
	all:undefined,
	structure: undefined,
	lights: undefined,
	seats: undefined,
	Base: undefined,
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
		this.controls.lookSpeed = 0.05;
		this.controls.autoForward = false;
	},
	
	init : function()
	{	
		//create structure
		this.structure = new THREE.Object3D();
		for(var i = 0; i< this.Partitions;i++)
		{
			var newAngle = (Math.PI*2/this.Partitions)*i;
			
			for(var j = -1; j < 2; j=j+2)
			{
				
				var structureG = new THREE.CylinderGeometry(this.PartitionThickness/4,this.PartitionThickness/4,this.PartitionLength,32);
				//var structureM = new THREE.MeshBasicMaterial({color:0xaaffaa});
				var structureM = new THREE.MeshPhongMaterial({color: 0x9db3b5, overdraw: true});
				var structure = new THREE.Mesh(structureG,structureM)
				
				structure.position.x = ( (this.PartitionLength/2)*(Math.cos(newAngle)));
				structure.position.z = ( (this.PartitionLength/2)*(Math.sin(newAngle)));
				
				
				var lookAt = new THREE.Vector3(0,0,0);
				structure.lookAt(lookAt);
				
				//structure.rotation = new THREE.Euler( 0, 0, Math.PI/2, 'XYZ' );
				structure.rotateOnAxis(new THREE.Vector3(0,0,1),Math.PI/2);
				structure.rotateOnAxis(new THREE.Vector3(1,0,0),Math.PI/2);
				
				structure.position.y = j*this.BaseWidth/2 - (j*this.PartitionThickness/4 + j*this.PartitionThickness/20);
				
				
				this.structure.add(structure);
			}
			
			
		}
		
		//create base
		
		//create seats
		this.seats = new THREE.Object3D();
		for(var i = 0; i< this.Partitions;i++)
		{
			
		}
		
		
		//create the base
		var allG = new THREE.CylinderGeometry(this.PartitionThickness,this.PartitionThickness,this.BaseWidth,32);
		//var allM = new THREE.MeshBasicMaterial({color:0xaaaaaa});
		var allM = new THREE.MeshPhongMaterial({color: 0xaaaaaa, overdraw: true});
		this.all = new THREE.Mesh(allG,allM);
		
		//stand up the ferrisWheel
		this.all.rotation = new THREE.Euler( 0, 0, Math.PI/2, 'XYZ' );
		
		//add structure and seats to all
		this.all.add(this.structure);
		this.all.add(this.camera);
		
	},

	Update : function()
	{
		if(app.keydown[72] && !this.keydown)
		{
			this.active = !this.active;
			//this.controls.object.rotation = new THREE.Euler( Math.PI/2, 0, 0, 'XYZ' );
			this.camera.rotateOnAxis(new THREE.Vector3(0,1,0),Math.PI/2);
			this.controls.lon = 90;
		}
		if(app.keydown[72] != this.keydown)
		{
			this.keydown = app.keydown[72];
		}
		
		if(this.active)
		{
			this.structure.rotation.y += 0.001;
			
			//this.controls.object.rotation.z+=Math.PI/2;
			
			this.camera.position.x = -( (this.PartitionLength)*(Math.cos(this.structure.rotation.y)));
			this.camera.position.z = ( (this.PartitionLength)*(Math.sin(this.structure.rotation.y)));
			
		}
	}
};
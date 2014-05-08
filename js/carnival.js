// carnival.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.carnival = {
    	// CONSTANT properties

		// variable properties
		renderer: undefined,
		scene: undefined,
		camera: undefined,
		light: undefined,
		ferisWheel: undefined,
		grassMan: undefined,
		myobjects: [],
		paused: false,
		dt: 1/60,
		controls: undefined,

  	init : function(fov,height,width,aspect,near,far) {
  		console.log('init called');
  		this.setupThreeJS(fov,height,width,aspect,near,far);
		app.ferrisWheel.initCamera( fov, aspect, near, far );
  		this.setupWorld();
  		this.update();
  	},


    update: function(){
    	// schedule next animation frame
    	app.animationID = requestAnimationFrame(this.update.bind(this));

		// PAUSED?
		if (app.paused){
			this.drawPauseScreen();
			return;
		 }

		// UPDATE

		// Update sky color
		//this.renderer.setClearColor( 0xffffff, 1);
		TWEEN.update();
		this.light.intensity = app.skytween.getSunLightIntensity() + 0.5;
		
		// update ferrisWheel
		app.ferrisWheel.Update();
		
		// DRAW
		if(app.ferrisWheel.active)
		{
			this.renderer.render(this.scene, app.ferrisWheel.camera);
			app.ferrisWheel.controls.update(this.dt);
		}
		else
		{
			this.renderer.render(this.scene, this.camera);
			this.controls.update(this.dt);
		}
	},

	setupThreeJS: function(fov,height,width,aspect,near,far) {
				this.scene = new THREE.Scene();
				//this.scene.fog = new THREE.FogExp2(0x9db3b5, 0.002);

				this.camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
				this.camera.position.y = 200;
				this.camera.position.z = 0;
				this.camera.position.x = -300;

				this.renderer = new THREE.WebGLRenderer({antialias: true});
				this.renderer.setSize( width, height );
				this.renderer.shadowMapEnabled = true;
				document.body.appendChild(this.renderer.domElement );

				this.controls = new THREE.FirstPersonControls(this.camera);
				
				this.controls.movementSpeed = 100;
				this.controls.lookSpeed = 0.05;
				this.controls.autoForward = false;
			},

	setupWorld: function() {
		var geo = new THREE.PlaneGeometry(2000, 2000, 40, 40);
		//var mat = new THREE.MeshPhongMaterial({color: 0x9db3b5, overdraw: true});
		
        var texture = THREE.ImageUtils.loadTexture( "textures/grass.jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 8, 8 );

        var maxAST = this.renderer.getMaxAnisotropy();
        texture.anisotropy = maxAST;

        var mat = new THREE.MeshPhongMaterial({map:texture});

				var floor = new THREE.Mesh(geo, mat);
				floor.rotation.x = -0.5 * Math.PI;
				floor.receiveShadow = true;
				this.scene.add(floor);

        // sky colors
        app.skytween.init();

        // directional light to represent sun
        this.light = new THREE.DirectionalLight(0xf9f1c2, 1);
        this.light.position.set(-500, 1500, 1000);
        this.light.castShadow = true;
        this.light.shadowMapWidth = 2048;
        this.light.shadowMapHeight = 2048;

        // distance for near and far clipping planes
        var d = 1000;
        this.light.shadowCameraLeft = d;
        this.light.shadowCameraRight = -d;
        this.light.shadowCameraTop = d;
        this.light.shadowCameraBottom = -d;
        this.light.shadowCameraFar = 2500;
        this.scene.add(this.light);

        var pointLight = new THREE.PointLight(0xf9f1c2, 1, 100);
        pointLight.position.set(1, 50, 1);
        this.scene.add(pointLight);
		
		//ferris wheel
		app.ferrisWheel.init();
		app.ferrisWheel.all.position.set(1,230,1);
		this.scene.add(app.ferrisWheel.all);
		
		// obj loader
		app.MeshLoader.loadMesh('textures/grass.jpg', 'models/male02.obj', this.grassMan);
	},


	drawPauseScreen: function(){
		// do something pause-like if you want
	}


};

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
		myobjects: [],
		paused: false,
		dt: 1/60,
		controls: undefined,

  	init : function(fov,height,width,aspect,near,far) {
  		console.log('init called');
  		this.setupThreeJS(fov,height,width,aspect,near,far);
      app.ferrisWheel.initCamera( fov, aspect, near, far );
      app.GameStand.initCamera(fov, aspect, near, far);
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

    // update game stand
    app.GameStand.update();

		// DRAW
		if(app.ferrisWheel.active)
		{
			this.renderer.render(this.scene, app.ferrisWheel.camera);
			app.ferrisWheel.controls.update(this.dt);
		}
    else if(app.GameStand.active)
    {
      this.renderer.render(this.scene, app.GameStand.camera);
      //app.ferrisWheel.controls.update(this.dt);
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
        //this.light.castShadow = true;
        this.scene.add(this.light);

        var pointLight = new THREE.PointLight(0xf9f1c2, 1, 100);
        pointLight.position.set(1, 50, 1);
        this.scene.add(pointLight);

        var ambientLight = new THREE.AmbientLight( 0x303030 ); // soft white light
        ambientLight.intensity = 0.01;
        this.scene.add( ambientLight );

		//ferris wheel
		app.ferrisWheel.init();
		app.ferrisWheel.all.position.set(1,app.ferrisWheel.PartitionLength*app.ferrisWheel.BaseLengthModifier,1);
		this.scene.add(app.ferrisWheel.all);

		// obj loader
		app.FoodStand.load('textures/foodstand.jpg', 'models/stand1.obj');
    app.GameStand.load('textures/gamestand.jpg', 'models/stand2.obj');
    app.Tent.load(null, 'models/tent2.obj');
    app.Tent.loadPizza('textures/pizza.jpg', 'models/pizza_box_v01.obj')
	},

  doRaycast: function(event) {
    event.preventDefault();
    var projector = new THREE.Projector();

    // Define the camera to use for raycasts
    var currentCam = this.camera;
    if(app.ferrisWheel.active)
    {
      currentCam = app.ferrisWheel.camera;
    } else if(app.GameStand.active) {
      currentCam = app.GameStand.camera;
    }

    // 2D point where we clicked on the screen
    var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) *
    2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
    //console.log("Vector is x=" + vector.x + ",y=" + vector.y + ",z=" + vector.z);

    // 2D point converted to 3D point in world
    projector.unprojectVector(vector, currentCam);
    //console.log("Unprojected Vector x=" + vector.x + ",y=" + vector.y +",z=" + vector.z);

    // cast a ray from the camera to the 3D point we clicked on
    var raycaster = new THREE.Raycaster(currentCam.position,
    vector.sub(currentCam.position).normalize());

    app.GameStand.doRaycast(raycaster);

    // an array of objects we are checking for intersections
    // you’ll need to put your own objects here
    var intersects = raycaster.intersectObjects([app.GameStand.mesh]);


/*
    // See if the player clicked on the stand
    if (intersects.length > 0) {

      // if the player DID click on the Game Stand...
      if(intersects[0].object == app.GameStand.mesh)
      {
        // If playing mini game, toss ball
        if(app.GameStand.active)
        {
          app.GameStand.tossBall();
        }
        // Otherwise, start playing
        else
        {
          app.GameStand.active = true;
          app.ferrisWheel.active = false;
        }
      }
      // if the player clicked away from the game stand
      else
      {

      }
    }
    */
  },

	drawPauseScreen: function(){
		// do something pause-like if you want
	}


};

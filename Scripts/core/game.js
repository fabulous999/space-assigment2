/// <reference path="_reference.ts"/>
// MAIN GAME FILE
// THREEJS Aliases
var Scene = THREE.Scene;
var Renderer = THREE.WebGLRenderer;
var PerspectiveCamera = THREE.PerspectiveCamera;
var BoxGeometry = THREE.BoxGeometry;
var CubeGeometry = THREE.CubeGeometry;
var PlaneGeometry = THREE.PlaneGeometry;
var SphereGeometry = THREE.SphereGeometry;
var Geometry = THREE.Geometry;
var AxisHelper = THREE.AxisHelper;
var LambertMaterial = THREE.MeshLambertMaterial;
var MeshBasicMaterial = THREE.MeshBasicMaterial;
var Material = THREE.Material;
var Mesh = THREE.Mesh;
var Object3D = THREE.Object3D;
var SpotLight = THREE.SpotLight;
var PointLight = THREE.PointLight;
var AmbientLight = THREE.AmbientLight;
var Control = objects.Control;
var GUI = dat.GUI;
var Color = THREE.Color;
var Vector3 = THREE.Vector3;
var Face3 = THREE.Face3;
var Point = objects.Point;
var CScreen = config.Screen;
var Control2 = objects.Control;
var ring = THREE.RingGeometry;
//Custom Game Objects
var gameObject = objects.gameObject;
var loader = new THREE.JSONLoader();
var animation;
var scene;
var renderer;
var camera;
var axes;
var cube;
var plane;
var sphere;
var ambientLight;
var spotLight;
var control;
var control2;
var gui;
var stats;
var step = 0;
var ambientColour;
var sphereMaterial, earthMaterial;
var lightFront = null, lightFront2 = null, lightFront3 = null;
var callbacks = null, mousePressed = false, DISPLACEMENT = 0.15, SPRING_STRENGTH = 0.0005, DAMPEN = 0.998, DEPTH = 600, ORIGIN = new THREE.Vector3(), cameraOrbit = 0, CAMERA_ORBIT = 0.0025, autoDistortTimer = null;
var ringgeo = new THREE.RingGeometry, ringmesh, ringmat;
//planet/moon 
var earth, moon, uranus, mars, mercury, venus, jupiter, saturn, neptune;
//button function
var earths = { earth: function () { earth.add(camera), camera.lookAt(earth.position), camera.position.set(75, 0, 0), camera.rotateY(9.9); } };
var moons = { moon: function () { moon.add(camera), camera.lookAt(moon.position), camera.position.set(50, 0, 0), camera.rotateY(9.9); } };
var uranuss = { uranus: function () { uranus.add(camera), camera.lookAt(uranus.position), camera.position.set(60, 0, 0), camera.rotateY(9.9); } };
var marss = { mars: function () { mars.add(camera); camera.lookAt(mars.position); camera.position.set(50, 0, 0); } };
var sols = { sol: function () { scene.add(camera); camera.lookAt(sphere.position); camera.position.set(-700, 50, -25); } };
var jupiters = { jupiter: function () { scene.add(camera); camera.lookAt(jupiter.position); camera.position.set(80, 0, 0), camera.rotateY(9.9); } };
var saturns = { saturn: function () { scene.add(camera); camera.lookAt(saturn.position); camera.position.set(50, 0, 0), camera.rotateY(11); } };
//orbit ring
var ringearthgeo = new THREE.RingGeometry, ringearhtmesh, ringearthmat;
var ringmercarygeo = new THREE.RingGeometry, ringmercarymesh, ringmercarymat;
var ringvenusgeo = new THREE.RingGeometry, ringvenusmesh, ringvenusmat;
var ringmarsgeo = new THREE.RingGeometry, ringmarsmesh, ringmarsmat;
var ringjupitergeo = new THREE.RingGeometry, ringjupitermesh, ringjupitermat;
var ringsaturngeo = new THREE.RingGeometry, ringsaturnmesh, ringsaturnmat;
var ringuranusgeo = new THREE.RingGeometry, ringuranusmesh, ringuranusmat;
var ringneptunegeo = new THREE.RingGeometry, ringneptunemesh, ringneptunemat;
// texture
var sun = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('texture/earth.jpg'), shininess: 2000, shading: THREE.SmoothShading });
var earthtext = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('texture/pl_sun.jpg'), shininess: 2000, shading: THREE.SmoothShading });
var moontext = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('texture/moon.png'), shininess: 2000, shading: THREE.SmoothShading });
var uranustext = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('texture/uranus.png'), shininess: 2000, shading: THREE.SmoothShading });
var marstext = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('texture/mars.jpg'), shininess: 2000, shading: THREE.SmoothShading });
var mercarytext = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('texture/mercury.jpg'), shininess: 2000, shading: THREE.SmoothShading });
var venustext = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('texture/venus.jpg'), shininess: 2000, shading: THREE.SmoothShading });
var jupitertext = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('texture/jupiter.jpg'), shininess: 2000, shading: THREE.SmoothShading });
var saturnringtext = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('texture/saturnrings.png'), shininess: 2000, shading: THREE.SmoothShading });
var saturntext = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('texture/saturn.png'), shininess: 2000, shading: THREE.SmoothShading });
var neptunetext = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('texture/neptune.jpg'), shininess: 2000, shading: THREE.SmoothShading });
var texture2 = new THREE.TextureLoader().load('texture/pl_sun.jpg');
var texture2s = new THREE.MeshPhongMaterial({ map: texture2 });
//planet geo
var spheregeo, earthgeo, moongeo, uranusgeo, marsgeo, mercurygeo, venusgeo, jupitergeo;
var saturngeo, neptunegeo;
var width = window.innerWidth, height = window.innerHeight, ratio = width / height;
function init() {
    // Instantiate a new Scene object
    scene = new Scene();
    setupRenderer(); // setup the default renderer
    //checkIntersection(spheregeo);
    setupCamera(); // setup the camera
    // add an axis helper to the scene
    axes = new AxisHelper(10);
    scene.add(axes);
    console.log("Added Axis Helper to scene...");
    //Add a Plane to the Scene
    // plane = new gameObject(
    //   new PlaneGeometry(16, 16, 1, 1),material, 0, 0, 0);
    plane = new gameObject(new PlaneGeometry(20, 40), earthtext, 0, 0, 0);
    plane.rotation.x = -0.5 * Math.PI;
    //scene.add(plane);
    console.log("Added Plane Primitive (Floor) to Scene");
    //plane.rotation.x = -0.5 * Math.PI;
    //scene.add(plane);
    console.log("Added Plane Primitive to scene...");
    // var geoss = new Geometry();
    // saturn ring
    ringgeo = new THREE.RingGeometry(35, 0, 14, 1, 2, Math.PI * 2);
    ringmesh = new Mesh(ringgeo, saturnringtext);
    ringmesh.position.set(0, 0, 0);
    ringmesh.rotation.x = 56.5;
    // earth orbit
    ringearthgeo = new THREE.RingGeometry(173, 175, 14, 1, 2, Math.PI * 2);
    ringearhtmesh = new Mesh(ringearthgeo, saturnringtext);
    ringearhtmesh.position.set(0, 0, 0);
    ringearhtmesh.rotation.x = 105.2;
    // mercury orbit
    ringmercarygeo = new THREE.RingGeometry(84, 85, 14, 1, 2, Math.PI * 2);
    ringmercarymesh = new Mesh(ringmercarygeo, sun);
    ringmercarymesh.position.set(0, 0, 0);
    ringmercarymesh.rotation.x = 105.2;
    // venus orbit
    ringvenusgeo = new THREE.RingGeometry(124, 125, 14, 1, 2, Math.PI * 2);
    ringvenusmesh = new Mesh(ringvenusgeo, sun);
    ringvenusmesh.position.set(0, 0, 0);
    ringvenusmesh.rotation.x = 105.2;
    // mars orbit
    ringmarsgeo = new THREE.RingGeometry(204, 205, 14, 1, 2, Math.PI * 2);
    ringmarsmesh = new Mesh(ringmarsgeo, sun);
    ringmarsmesh.position.set(0, 0, 0);
    ringmarsmesh.rotation.x = 105.2;
    // jupiter orbit
    ringjupitergeo = new THREE.RingGeometry(254, 255, 14, 1, 2, Math.PI * 2);
    ringjupitermesh = new Mesh(ringjupitergeo, sun);
    ringjupitermesh.position.set(0, 0, 0);
    ringjupitermesh.rotation.x = 105.2;
    // saturn orbit
    ringsaturngeo = new THREE.RingGeometry(304, 305, 14, 1, 2, Math.PI * 2);
    ringsaturnmesh = new Mesh(ringsaturngeo, sun);
    ringsaturnmesh.position.set(0, 0, 0);
    ringsaturnmesh.rotation.x = 105.2;
    // uranus orbit
    ringuranusgeo = new THREE.RingGeometry(374, 375, 14, 1, 2, Math.PI * 2);
    ringuranusmesh = new Mesh(ringuranusgeo, sun);
    ringuranusmesh.position.set(0, 0, 0);
    ringuranusmesh.rotation.x = 105.2;
    // neptune orbit
    ringneptunegeo = new THREE.RingGeometry(414, 415, 14, 1, 2, Math.PI * 2);
    ringneptunemesh = new Mesh(ringneptunegeo, sun);
    ringneptunemesh.position.set(0, 0, 0);
    ringneptunemesh.rotation.x = 105.2;
    //sun
    var spheremat = new THREE.MeshLambertMaterial({ wireframe: true });
    spheregeo = new SphereGeometry(40, 75, 75);
    sphere = new Mesh(spheregeo, earthtext);
    sphere.position.set(0, 0, 0);
    //mercury
    mercurygeo = new SphereGeometry(5, 75, 75);
    mercury = new Mesh(mercurygeo, mercarytext);
    mercury.position.set(85, 0, 0);
    //venus
    venusgeo = new SphereGeometry(10, 75, 75);
    venus = new Mesh(venusgeo, venustext);
    venus.position.set(125, 0, 0);
    // earth
    earthgeo = new SphereGeometry(13, 75, 75);
    earth = new Mesh(earthgeo, sun);
    earth.position.set(175, 0, 0);
    //moon
    moongeo = new SphereGeometry(2, 75, 75);
    moon = new Mesh(moongeo, moontext);
    moon.position.set(40, 0, 0);
    //mars
    marsgeo = new SphereGeometry(10, 75, 75);
    mars = new Mesh(marsgeo, marstext);
    mars.position.set(-205, 0, 0);
    //jupiter
    jupitergeo = new SphereGeometry(30, 75, 75);
    jupiter = new Mesh(jupitergeo, jupitertext);
    jupiter.position.set(-255, 0, 0);
    //saturn
    saturngeo = new SphereGeometry(25, 75, 75);
    saturn = new Mesh(saturngeo, saturntext);
    saturn.position.set(305, 0, 0);
    //uranus
    uranusgeo = new SphereGeometry(15, 75, 75);
    uranus = new Mesh(uranusgeo, uranustext);
    uranus.position.set(375, 0, 0);
    //neptune
    neptunegeo = new SphereGeometry(15, 75, 75);
    neptune = new Mesh(neptunegeo, neptunetext);
    neptune.position.set(415, 0, 0);
    scene.add(sphere);
    sphere.add(ringearhtmesh);
    sphere.add(ringmercarymesh);
    sphere.add(ringvenusmesh);
    sphere.add(ringmarsmesh);
    sphere.add(ringjupitermesh);
    sphere.add(ringsaturnmesh);
    sphere.add(ringuranusmesh);
    sphere.add(ringneptunemesh);
    //  sphere.add(mars)
    //sphere.add(earth);
    earth.add(moon);
    saturn.add(ringmesh);
    ringearhtmesh.add(earth);
    ringmercarymesh.add(mercury);
    ringvenusmesh.add(venus);
    ringmarsmesh.add(mars);
    ringjupitermesh.add(jupiter);
    ringsaturnmesh.add(saturn);
    ringuranusmesh.add(uranus);
    ringneptunemesh.add(neptune);
    //  ambientLight = new AmbientLight(ambientColour);
    // Add an AmbientLight to the scene
    ambientLight = new AmbientLight(0x090909 * 6);
    // ambientLight.intensity = 0.5;
    scene.add(ambientLight);
    console.log("Added an Ambient Light to Scene");
    // Add a SpotLight to the scene
    spotLight = new SpotLight(0xffffff);
    spotLight.position.set(-0, 4, 0);
    spotLight.rotation.set(-0.8, 42.7, 19.5);
    spotLight.castShadow = true;
    spotLight.intensity = 5;
    scene.add(spotLight);
    console.log("Added a SpotLight Light to Scene");
    lightFront = new THREE.PointLight(0xFFFFFF, 0.3);
    lightFront.position.y = 0;
    scene.add(lightFront);
    lightFront2 = new THREE.PointLight(0xFFFFFF, 1);
    lightFront2.position.y = -250;
    //  lightFront3.position.X = -50;
    lightFront2.rotation.y = 15;
    scene.add(lightFront2);
    lightFront3 = new THREE.PointLight(0xFFFFFF, 1);
    lightFront3.position.y = 250;
    //  lightFront3.position.X = 50;
    lightFront3.rotation.y = -15;
    scene.add(lightFront3);
    // add controls
    gui = new GUI();
    //  control = new Control(0.05);
    control = new Control(0.00, ambientColour);
    addControl(control);
    // Add framerate stats
    addStatsObject();
    console.log("Added Stats to scene...");
    document.body.appendChild(renderer.domElement);
    requestAnimationFrame(gameLoop);
    function addControl(controlObject) {
        gui.add(controlObject, 'rotationSpeedx', -0.5, 0.5);
        // gui.add(controlObject, 'rotationSpeedy', -0.5, 0.5);
        // gui.add(controlObject, 'rotationSpeedz', -0.5, 0.5);
        gui.add(earths, 'earth');
        //   gui.add(moons,'moon');
        //   gui.add(uranuss,'uranus');
        gui.add(marss, 'mars');
        gui.add(sols, 'sol');
        //   gui.add(saturns,'saturn');
        //  gui.add(jupiters,'jupiter');
    }
    function addStatsObject() {
        stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);
    }
    // Setup main game loop
    function gameLoop() {
        stats.update();
        sphere.rotation.y += control.rotationSpeedx;
        earth.rotation.z += control.rotationSpeedx;
        mercury.rotation.z += control.rotationSpeedx;
        venus.rotation.z += control.rotationSpeedx;
        mars.rotation.z += control.rotationSpeedx;
        neptune.rotation.z += control.rotationSpeedx;
        uranus.rotation.z += control.rotationSpeedx;
        saturn.rotation.z += control.rotationSpeedx;
        //  moon.rotation.z += control.rotationSpeedx / 2;
        // moon.rotation.x -= control.rotationSpeedx * 5;
        //  moon.rotation.y += control.rotationSpeedx;
        //  mars.rotation.y += control.rotationSpeedx;
        //  uranus.rotation.y += control.rotationSpeedx;
        /* ringearhtmesh.rotation.y += control.rotationSpeedx;
         ringmercarymesh.rotation.y += control.rotationSpeedx /2;
         ringvenusmesh.rotation.y += control.rotationSpeedx /3;
         ringmarsmesh.rotation.y += control.rotationSpeedx /4;
         ringjupitermesh.rotation.y += control.rotationSpeedx /5;
         ringsaturnmesh.rotation.y += control.rotationSpeedx /6;
         ringuranusmesh.rotation.y += control.rotationSpeedx /7;
         ringneptunemesh.rotation.y += control.rotationSpeedx /8;*/
        ringearhtmesh.rotation.z += control.rotationSpeedx;
        ringmercarymesh.rotation.z += control.rotationSpeedx / 2;
        ringvenusmesh.rotation.z += control.rotationSpeedx / 3;
        ringmarsmesh.rotation.z += control.rotationSpeedx / 4;
        ringjupitermesh.rotation.z += control.rotationSpeedx / 5;
        ringsaturnmesh.rotation.z += control.rotationSpeedx / 6;
        ringuranusmesh.rotation.z += control.rotationSpeedx / 7;
        ringneptunemesh.rotation.z += control.rotationSpeedx / 8;
        // ringearhtmesh.rotation.z += control.rotationSpeedx *2;
        //  camera.rotation.y += control.rotationSpeedx/5;
        // render using requestAnimationFrame
        requestAnimationFrame(gameLoop);
        // render the scene
        renderer.render(scene, camera);
        // camera.rotation.x -= control.rotationSpeedx;
    }
    // Setup default renderer
    function setupRenderer() {
        renderer = new Renderer();
        renderer.setTexture(texture2, 0);
        //  renderer.setClearColor(texture2,0);
        // renderer.setClearColor(0xEEEEEE, 9.0);
        renderer.setSize(width, height);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        console.log("Finished setting up Renderer...");
        texture2.needsUpdate = true;
    }
    // Setup main camera for the scene
    function setupCamera() {
        //  camera = new PerspectiveCamera(60, ratio, 0.1, 1000);
        camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = -700;
        camera.position.y = 100;
        camera.position.z = -25.5;
        camera.lookAt(new Vector3(0, -50, 0));
        console.log("Finished setting up Camera...");
    }
    /*  createSprings();
      bindCallbacks();
      displaceRandomFace();
      requestAnimationFrame(animate);
  /*
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  /*
  
  
  
   function checkIntersection(evt) {
  
      // get the mouse position and create
      // a projector for the ray
      var mouseX    = evt.offsetX || evt.clientX,
          mouseY    = evt.offsetY || evt.clientY;
  
      // set up a new vector in the correct
      // coordinates system for the screen
      var vector    = new THREE.Vector3(
         (mouseX / window.innerWidth) * 2 - 1,
        -(mouseY / window.innerHeight) * 2 + 1,
         0.5);
  
      // now "unproject" the point on the screen
      // back into the the scene itself. This gives
      // us a ray direction
       vector.unproject(camera);
      // create a ray from our current camera position
      // with that ray direction and see if it hits the sphere
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var  intersects = raycaster.intersectObject(sphere,true);
      console.log(mouseX+" testing click  "+mouseY);
      // if the ray intersects with the
      // surface work out where and distort the face
      if(intersects.length) {
        displaceFace(intersects[0].face, DISPLACEMENT);
      }
    }
  function bindCallbacks() {
  
      // create our callbacks object
      callbacks = {
  
        
        // * Called when the browser resizes
         
        onResize: function() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize( window.innerWidth, window.innerHeight );
        },
  
       
        // * Called when the user clicks
         
         //* @param {Event} evt The mouse event
         
        onMouseDown: function(evt) {
          mousePressed = true;
  
          checkIntersection(evt);
  
          // clear the timer for the automatic wibble
          clearTimeout(autoDistortTimer);
        },
  
    
       //  * Called when the user moves the mouse
         
       //  * @param {Event} evt The mouse event
        
        onMouseMove: function(evt) {
          if(mousePressed) {
            checkIntersection(evt);
          }
        },
  
     
        // * Called when the user releases
        
       //  * @param {Event} evt The mouse event
       
        onMouseUp: function() {
          mousePressed = false;
          // reset the timer for the automatic wibble
         autoDistortTimer = setTimeout(displaceRandomFace, 2000);
      },
     
        // * Prevent the user getting the text
       //  * selection cursor
     
        onSelectStart: function() {
          return false;
   }
   
  };
  
      // now bind them on
      window.addEventListener('resize', callbacks.onResize, false);
      window.addEventListener('mousedown', callbacks.onMouseDown, false);
      window.addEventListener('mousemove', callbacks.onMouseMove, false);
      window.addEventListener('mouseup', callbacks.onMouseUp, false);
  
      renderer.domElement.addEventListener('selectstart', callbacks.onSelectStart, false);
    }
  
   //  * Creates an individual spring
    
   //  *   var sphereFaces = spheregeo.faces;
    // for(var f = 0; f < sphereFaces.length; f++) {
   //     var face = sphereFaces[f];
    //    sphere.geometry.computeFaceNormals.length;
   //  * @param {Number} start The index of the vertex for the spring's start
   //  * @param {Number} end The index of the vertex for the spring's start
     
    function createSprings() {
   //  var sphereFaces = spheregeo.faces;   sphere.geometry.computeFaceNormals.length
   
     for(var f = 0; f < sphere.geometry.computeFaceNormals.length; f++) {
       
        var face = spheregeo.faces[f];
       // these may be Face3s, i.e. composed of
        // three vertices, or Face4s, so we need
        // to double check and not use face.d if
        // it doesn't exist.
            
        if(face instanceof THREE.Face3) {
  
          createSpring(face.a, face.b);
          createSpring(face.b, face.c);
          createSpring(face.c, face.a);
     
         
        } else {
  
          createSpring(face.a, face.b);
          createSpring(face.b, face.c);
          createSpring(face.c, face.d);
          createSpring(face.d, face.a);
        }
   
      }
        
    }
    
   function createSpring(start, end) {
      var sphereVertices = spheregeo.vertices.length; //sphere.geometry.computeVertexNormals.length;  //sphere.geometry.vertices;lengthsphere.geometry.computeVertexNormals.length;
      var startVertex    = sphereVertices[start];
      var endVertex      = sphereVertices[end];
    // geoss.verticesNeedUpdate
      // if the springs array does not
      // exist for a particular vertex
      // create it
      if(!startVertex.springs) {
          startVertex.springs = [];
        // take advantage of the one-time init
        // and create some other useful vars
        startVertex.normal = startVertex.clone().normalize();
        startVertex.originalPosition = startVertex.clone();
      }
  
      // repeat the above for the end vertex
      if(!endVertex.springs) {
        endVertex.springs = [];
        endVertex.normal = startVertex.clone().normalize();
        endVertex.originalPosition = endVertex.clone();
      }
  
      if(!startVertex.velocity) {
        startVertex.velocity = new THREE.Vector3();
      }
  
      // finally create a spring
      startVertex.springs.push({
  
        start   : startVertex,
        end     : endVertex,
        length  : startVertex.length(endVertex)
      });
      
      console.log("it work"+start );
    }
    
    function displaceRandomFace() {
  
      var sphereFaces     = spheregeo.faces, //, //sphere.geometry.computeFaceNormals, //
          randomFaceIndex = Math.floor(Math.random() * sphereFaces.length),
          randomFace      = sphereFaces[randomFaceIndex];
  
      displaceFace(randomFace, DISPLACEMENT);
  
      autoDistortTimer = setTimeout(displaceRandomFace, 100);
    }
  
    // * Displaces the vertices of a face
  
    // * @param {THREE.Face3|4} face The face to be displaced
    // * @param {Number} magnitude By how much the face should be displaced
   
    function displaceFace(face, magnitude) {
  
      // displace the first three vertices
      displaceVertex(face.a, magnitude);
      displaceVertex(face.b, magnitude);
      displaceVertex(face.c, magnitude);
  
      // if this is a face4 do the final one
      if(face instanceof THREE.Face3) {  //face4
  //      displaceVertex(face.d, magnitude);
      }
  
    }
  
   //  * Goes through each vertex's springs
   //  * and determines what forces are acting on the
   //  * spring's vertices. It then updates the vertices
   //  * and also dampens them back to their original
   //  * position.
     
     function displaceVertex(vertex, magnitude) {
      //sphere.geometry.vertices
         console.log("vertex :" + vertex);
      var sphereVertices = spheregeo.vertices;
      //vertex = 2;
      // add to the velocity of the vertex in question
      // but make sure we're doing so along the normal
      // of the vertex, i.e. along the line from the
      // sphere centre to the vertex
     sphereVertices[vertex].add(sphereVertices[vertex].clone().multiplyScalar(magnitude));
  
    // sphereVertices[vertex].velocity.add(sphereVertices[vertex].normal.clone().multiplyScalar(magnitude));
    }
    function updateVertexSprings() {
  
      // go through each spring and
      // work out what the extension is
      var sphereVertices = spheregeo.vertices, //sphere.geometry.computeVertexNormals, //, spheregeo.vertices
          vertexCount    = sphereVertices.length,  ///spheregeo.vertices.length, //
          vertexSprings  = null,
          vertexSpring   = null,
          extension      = 0,
          length         = 0,
          force          = 0,
          vertex         = null, //vertexSpring,
          acceleration   = new THREE.Vector3(0, 0, 0);
       //   var v  : number =0;
     // go backwards, which should
      // be faster than a normal for-loop
      // although that's not always the case
    
      while(vertexCount--) {
   
        vertex = sphereVertices.length;
       // vertex.springs = [];
        vertexSprings = vertex
      // console.log("it updating   " + sphereVertices.length);
     //console.log(" sphereVertices  "+ sphereVertices +" certex: "+ vertex +" vertex.spring ssad "+ vertex.springs);
  
        // miss any verts with no springs
        if(!vertexSprings) {
          continue;
     //console.log("-1 vertexSpring");
        }
     
  // console.log("it updating  after wqrqw " + vertexCount /* vertexSprings[vertexCount] );
  // console.log("afsfasasf  "+vertexSprings.length);
        // now go through each individual spring
        for(var v = 0; v < sphereVertices.length; v++) {
          // calculate the spring length compared
          // to its base length
          console.log("it updating  afterssss  " + v);
       
           vertexSpring = vertexSprings[v];  // sphereVertices[v];//[v]; //spheregeo.vertices[v]; //
      //console.log("fahioafiofa  " + vertexSpring); // spheregeo.vertices.indexOf(vertexSpring,v))//lastIndexOf(vertexSpring,v)); //vertexSpring
         length = vertexSpring// - vertexSpring.end;//.start.length(vertexSpring.end);
   console.log("it updating  afterssss  length " + length + "  " + vertexSpring);
          // now work out how far the spring has
          // extended and use this to create a
          // force which will pull on the vertex
      //    console.log( " guiupipiopiop" + acceleration.copy(vertexSpring.start.normals).multiplyScalar(extension * SPRING_STRENGTH));
     
          extension = sphereVertices.length;//  - length;  //vertexSpring.length
          console.log("extension  " + extension );
          // pull the start vertex
         
          acceleration.copy(vertexSpring).multiplyScalar(extension * SPRING_STRENGTH);
          vertexSpring.add(acceleration);
  
          // pull the end vertex  .normal
          acceleration.copy(vertexSpring).multiplyScalar(extension * SPRING_STRENGTH);
          vertexSpring.add(acceleration);
  
          // add the velocity to the position using
          // basic Euler integration
          vertexSpring.add(vertexSpring.start);
          vertexSpring.add(vertexSpring.end);
  //console.log("it updating faaaafff {0} {1} {2} " );
          // dampen the spring's velocity so it doesn't
          // ping back and forth forever
         vertexSpring.start.velocity.multiplyScalar(DAMPEN);
          vertexSpring.end.velocity.multiplyScalar(DAMPEN);
     vertex.add(vertex.originalPosition.clone().sub(vertex).multiplyScalar(0.03));
            
        }
  
        // attempt to dampen the vertex back
        // to its original position so it doesn't
        // get out of control
    
      }
    }
  
    // * Displaces an individual vertex
   
    // * @param {Number} vertex The index of the vertex in the geometry
   ///  * @param {Number} magnitude The degree of displacement
   
   
     function animate() {
  
      // update all the springs and vertex
      // positions
      updateVertexSprings();
      console.log("animation working");
      // move the camera around slightly
      // sin + cos = a circle
      cameraOrbit           += CAMERA_ORBIT;
      camera.position.x     = Math.sin(cameraOrbit) * DEPTH;
      camera.position.z     = Math.cos(cameraOrbit) * DEPTH;
      camera.lookAt(ORIGIN);
  
      // update the front light position to
      // match the camera's orientation
      lightFront.position.x = Math.sin(cameraOrbit) * DEPTH;
      lightFront.position.z = Math.cos(cameraOrbit) * DEPTH;
  
      // flag that the sphere's geometry has
      // changed and recalculate the normals
      spheregeo.verticesNeedUpdate = true;
      spheregeo.normalsNeedUpdate = true;
      sphere.geometry.computeFaceNormals();
      sphere.geometry.computeVertexNormals();
     
  
      // render
      renderer.render(scene, camera);
  
      // schedule the next run
      requestAnimationFrame(animate);
    }
  
    
   
    */
    /*
    
    
     //Add a Cube to the Scene
            
        ambientColour = "#0c0c0c";
       
    
    
     cubeMaterial = new LambertMaterial(ambientColour);
        legMaterial = new LambertMaterial(ambientColour);
        leg2Material = new LambertMaterial(ambientColour);
        arm2eMaterial = new LambertMaterial(ambientColour);
        armeMaterial = new LambertMaterial(ambientColour);
        headMaterial = new LambertMaterial(ambientColour);
        //cubeMaterial = new LambertMaterial({color:0x00ff00});
        cubeGeometry = new CubeGeometry(2, 3, 2);
        cube = new Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.position.set(0, 5, 0);
    
        legGeometry = new CubeGeometry(1, 3, 1);
        leg = new Mesh(legGeometry, legMaterial);
        leg.castShadow = true;
        leg.receiveShadow = true;
        leg.position.set(0.8, -3, 0);
    
        leg2 = new Mesh(legGeometry, leg2Material);
        leg2.castShadow = true;
        leg2.receiveShadow = true;
        leg2.position.set(-0.8, -3, 0);
    
        armGeometry = new CubeGeometry(1, 2, 1);
        arm = new Mesh(armGeometry, arm2eMaterial);
        arm.castShadow = true;
        arm.receiveShadow = true;
        arm.position.set(1.5, 0.5, 0);
    
        arm2 = new Mesh(armGeometry, armeMaterial);
        arm2.castShadow = true;
        arm2.receiveShadow = true;
        arm2.position.set(-1.5, 0.5, 0);
    
        headGeometry = new CubeGeometry(1, 1, 1);
        head = new Mesh(headGeometry, headMaterial);
        head.castShadow = true;
        head.receiveShadow = true;
        head.position.set(0, 2, 0);
    
    
    
        cube.add(leg);
        cube.add(leg2);
        cube.add(arm2);
        cube.add(arm);
        cube.add(head);
    
        scene.add(cube);
    
        console.log("Added Cube Primitive to scene...");
        
    
    
    
        cube.rotation.x += control.rotationSpeedx;
        cube.rotation.y += control.rotationSpeedy;
        cube.rotation.z += control.rotationSpeedz;
        
        
    
    
    
    
    
        var render = function () {
                    requestAnimationFrame( render );
                 
                    arm.rotation.x += 0.05;
                    arm2.rotation.x += 0.05;
                //renderer.render(scene, camera);
                };
    
                render();
    
    
    
    var cubeGeometry: CubeGeometry;
    var armeMaterial: LambertMaterial;
    var arm2eMaterial: LambertMaterial;
    var legMaterial: LambertMaterial;
    var leg2Material: LambertMaterial;
    var headMaterial: LambertMaterial;
    var cubeMaterial: LambertMaterial;
    var head: Mesh;
    var leg: Mesh;
    var leg2: Mesh;
    var arm: Mesh;
    var arm2: Mesh;
    var legGeometry: CubeGeometry;
    var armGeometry: CubeGeometry;
    var headGeometry: CubeGeometry;
    
      gui.addColor(controlObject, 'ambientColour').onChange((color) => { cubeMaterial.color = new Color(color); });
        gui.addColor(controlObject, 'ambientColour').onChange((color) => { legMaterial.color = new Color(color); });
        gui.addColor(controlObject, 'ambientColour').onChange((color) => { leg2Material.color = new Color(color); });
        gui.addColor(controlObject, 'ambientColour').onChange((color) => { arm2eMaterial.color = new Color(color); });
        gui.addColor(controlObject, 'ambientColour').onChange((color) => { armeMaterial.color = new Color(color); });
        gui.addColor(controlObject, 'ambientColour').onChange((color) => { headMaterial.color = new Color(color); });
        /* armeMaterial = new LambertMaterial(ambientColour);
        
        
         // window.addEventListener('resize', onResize, false);
    }
    
    function onResize(): void {
        camera.aspect = CScreen.RATIO;
        //camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        //renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
    }*/ }
/*  createSprings();
  bindCallbacks();
  displaceRandomFace();
  requestAnimationFrame(animate);
/*
}



























































/*



function checkIntersection(evt) {

  // get the mouse position and create
  // a projector for the ray
  var mouseX    = evt.offsetX || evt.clientX,
      mouseY    = evt.offsetY || evt.clientY;

  // set up a new vector in the correct
  // coordinates system for the screen
  var vector    = new THREE.Vector3(
     (mouseX / window.innerWidth) * 2 - 1,
    -(mouseY / window.innerHeight) * 2 + 1,
     0.5);

  // now "unproject" the point on the screen
  // back into the the scene itself. This gives
  // us a ray direction
   vector.unproject(camera);
  // create a ray from our current camera position
  // with that ray direction and see if it hits the sphere
var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
var  intersects = raycaster.intersectObject(sphere,true);
  console.log(mouseX+" testing click  "+mouseY);
  // if the ray intersects with the
  // surface work out where and distort the face
  if(intersects.length) {
    displaceFace(intersects[0].face, DISPLACEMENT);
  }
}
function bindCallbacks() {

  // create our callbacks object
  callbacks = {

    
    // * Called when the browser resizes
     
    onResize: function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    },

   
    // * Called when the user clicks
     
     //* @param {Event} evt The mouse event
     
    onMouseDown: function(evt) {
      mousePressed = true;

      checkIntersection(evt);

      // clear the timer for the automatic wibble
      clearTimeout(autoDistortTimer);
    },


   //  * Called when the user moves the mouse
     
   //  * @param {Event} evt The mouse event
    
    onMouseMove: function(evt) {
      if(mousePressed) {
        checkIntersection(evt);
      }
    },

 
    // * Called when the user releases
    
   //  * @param {Event} evt The mouse event
   
    onMouseUp: function() {
      mousePressed = false;
      // reset the timer for the automatic wibble
     autoDistortTimer = setTimeout(displaceRandomFace, 2000);
  },
 
    // * Prevent the user getting the text
   //  * selection cursor
 
    onSelectStart: function() {
      return false;
}

};

  // now bind them on
  window.addEventListener('resize', callbacks.onResize, false);
  window.addEventListener('mousedown', callbacks.onMouseDown, false);
  window.addEventListener('mousemove', callbacks.onMouseMove, false);
  window.addEventListener('mouseup', callbacks.onMouseUp, false);

  renderer.domElement.addEventListener('selectstart', callbacks.onSelectStart, false);
}

//  * Creates an individual spring

//  *   var sphereFaces = spheregeo.faces;
// for(var f = 0; f < sphereFaces.length; f++) {
//     var face = sphereFaces[f];
//    sphere.geometry.computeFaceNormals.length;
//  * @param {Number} start The index of the vertex for the spring's start
//  * @param {Number} end The index of the vertex for the spring's start
 
function createSprings() {
//  var sphereFaces = spheregeo.faces;   sphere.geometry.computeFaceNormals.length

 for(var f = 0; f < sphere.geometry.computeFaceNormals.length; f++) {
   
    var face = spheregeo.faces[f];
   // these may be Face3s, i.e. composed of
    // three vertices, or Face4s, so we need
    // to double check and not use face.d if
    // it doesn't exist.
        
    if(face instanceof THREE.Face3) {

      createSpring(face.a, face.b);
      createSpring(face.b, face.c);
      createSpring(face.c, face.a);
 
     
    } else {

      createSpring(face.a, face.b);
      createSpring(face.b, face.c);
      createSpring(face.c, face.d);
      createSpring(face.d, face.a);
    }

  }
    
}

function createSpring(start, end) {
  var sphereVertices = spheregeo.vertices.length; //sphere.geometry.computeVertexNormals.length;  //sphere.geometry.vertices;lengthsphere.geometry.computeVertexNormals.length;
  var startVertex    = sphereVertices[start];
  var endVertex      = sphereVertices[end];
// geoss.verticesNeedUpdate
  // if the springs array does not
  // exist for a particular vertex
  // create it
  if(!startVertex.springs) {
      startVertex.springs = [];
    // take advantage of the one-time init
    // and create some other useful vars
    startVertex.normal = startVertex.clone().normalize();
    startVertex.originalPosition = startVertex.clone();
  }

  // repeat the above for the end vertex
  if(!endVertex.springs) {
    endVertex.springs = [];
    endVertex.normal = startVertex.clone().normalize();
    endVertex.originalPosition = endVertex.clone();
  }

  if(!startVertex.velocity) {
    startVertex.velocity = new THREE.Vector3();
  }

  // finally create a spring
  startVertex.springs.push({

    start   : startVertex,
    end     : endVertex,
    length  : startVertex.length(endVertex)
  });
  
  console.log("it work"+start );
}

function displaceRandomFace() {

  var sphereFaces     = spheregeo.faces, //, //sphere.geometry.computeFaceNormals, //
      randomFaceIndex = Math.floor(Math.random() * sphereFaces.length),
      randomFace      = sphereFaces[randomFaceIndex];

  displaceFace(randomFace, DISPLACEMENT);

  autoDistortTimer = setTimeout(displaceRandomFace, 100);
}

// * Displaces the vertices of a face

// * @param {THREE.Face3|4} face The face to be displaced
// * @param {Number} magnitude By how much the face should be displaced

function displaceFace(face, magnitude) {

  // displace the first three vertices
  displaceVertex(face.a, magnitude);
  displaceVertex(face.b, magnitude);
  displaceVertex(face.c, magnitude);

  // if this is a face4 do the final one
  if(face instanceof THREE.Face3) {  //face4
//      displaceVertex(face.d, magnitude);
  }

}

//  * Goes through each vertex's springs
//  * and determines what forces are acting on the
//  * spring's vertices. It then updates the vertices
//  * and also dampens them back to their original
//  * position.
 
 function displaceVertex(vertex, magnitude) {
  //sphere.geometry.vertices
     console.log("vertex :" + vertex);
  var sphereVertices = spheregeo.vertices;
  //vertex = 2;
  // add to the velocity of the vertex in question
  // but make sure we're doing so along the normal
  // of the vertex, i.e. along the line from the
  // sphere centre to the vertex
 sphereVertices[vertex].add(sphereVertices[vertex].clone().multiplyScalar(magnitude));

// sphereVertices[vertex].velocity.add(sphereVertices[vertex].normal.clone().multiplyScalar(magnitude));
}
function updateVertexSprings() {

  // go through each spring and
  // work out what the extension is
  var sphereVertices = spheregeo.vertices, //sphere.geometry.computeVertexNormals, //, spheregeo.vertices
      vertexCount    = sphereVertices.length,  ///spheregeo.vertices.length, //
      vertexSprings  = null,
      vertexSpring   = null,
      extension      = 0,
      length         = 0,
      force          = 0,
      vertex         = null, //vertexSpring,
      acceleration   = new THREE.Vector3(0, 0, 0);
   //   var v  : number =0;
 // go backwards, which should
  // be faster than a normal for-loop
  // although that's not always the case

  while(vertexCount--) {

    vertex = sphereVertices.length;
   // vertex.springs = [];
    vertexSprings = vertex
  // console.log("it updating   " + sphereVertices.length);
 //console.log(" sphereVertices  "+ sphereVertices +" certex: "+ vertex +" vertex.spring ssad "+ vertex.springs);

    // miss any verts with no springs
    if(!vertexSprings) {
      continue;
 //console.log("-1 vertexSpring");
    }
 
// console.log("it updating  after wqrqw " + vertexCount /* vertexSprings[vertexCount] );
// console.log("afsfasasf  "+vertexSprings.length);
    // now go through each individual spring
    for(var v = 0; v < sphereVertices.length; v++) {
      // calculate the spring length compared
      // to its base length
      console.log("it updating  afterssss  " + v);
   
       vertexSpring = vertexSprings[v];  // sphereVertices[v];//[v]; //spheregeo.vertices[v]; //
  //console.log("fahioafiofa  " + vertexSpring); // spheregeo.vertices.indexOf(vertexSpring,v))//lastIndexOf(vertexSpring,v)); //vertexSpring
     length = vertexSpring// - vertexSpring.end;//.start.length(vertexSpring.end);
console.log("it updating  afterssss  length " + length + "  " + vertexSpring);
      // now work out how far the spring has
      // extended and use this to create a
      // force which will pull on the vertex
  //    console.log( " guiupipiopiop" + acceleration.copy(vertexSpring.start.normals).multiplyScalar(extension * SPRING_STRENGTH));
 
      extension = sphereVertices.length;//  - length;  //vertexSpring.length
      console.log("extension  " + extension );
      // pull the start vertex
     
      acceleration.copy(vertexSpring).multiplyScalar(extension * SPRING_STRENGTH);
      vertexSpring.add(acceleration);

      // pull the end vertex  .normal
      acceleration.copy(vertexSpring).multiplyScalar(extension * SPRING_STRENGTH);
      vertexSpring.add(acceleration);

      // add the velocity to the position using
      // basic Euler integration
      vertexSpring.add(vertexSpring.start);
      vertexSpring.add(vertexSpring.end);
//console.log("it updating faaaafff {0} {1} {2} " );
      // dampen the spring's velocity so it doesn't
      // ping back and forth forever
     vertexSpring.start.velocity.multiplyScalar(DAMPEN);
      vertexSpring.end.velocity.multiplyScalar(DAMPEN);
 vertex.add(vertex.originalPosition.clone().sub(vertex).multiplyScalar(0.03));
        
    }

    // attempt to dampen the vertex back
    // to its original position so it doesn't
    // get out of control

  }
}

// * Displaces an individual vertex

// * @param {Number} vertex The index of the vertex in the geometry
///  * @param {Number} magnitude The degree of displacement


 function animate() {

  // update all the springs and vertex
  // positions
  updateVertexSprings();
  console.log("animation working");
  // move the camera around slightly
  // sin + cos = a circle
  cameraOrbit           += CAMERA_ORBIT;
  camera.position.x     = Math.sin(cameraOrbit) * DEPTH;
  camera.position.z     = Math.cos(cameraOrbit) * DEPTH;
  camera.lookAt(ORIGIN);

  // update the front light position to
  // match the camera's orientation
  lightFront.position.x = Math.sin(cameraOrbit) * DEPTH;
  lightFront.position.z = Math.cos(cameraOrbit) * DEPTH;

  // flag that the sphere's geometry has
  // changed and recalculate the normals
  spheregeo.verticesNeedUpdate = true;
  spheregeo.normalsNeedUpdate = true;
  sphere.geometry.computeFaceNormals();
  sphere.geometry.computeVertexNormals();
 

  // render
  renderer.render(scene, camera);

  // schedule the next run
  requestAnimationFrame(animate);
}



*/
/*


 //Add a Cube to the Scene
        
    ambientColour = "#0c0c0c";
   


 cubeMaterial = new LambertMaterial(ambientColour);
    legMaterial = new LambertMaterial(ambientColour);
    leg2Material = new LambertMaterial(ambientColour);
    arm2eMaterial = new LambertMaterial(ambientColour);
    armeMaterial = new LambertMaterial(ambientColour);
    headMaterial = new LambertMaterial(ambientColour);
    //cubeMaterial = new LambertMaterial({color:0x00ff00});
    cubeGeometry = new CubeGeometry(2, 3, 2);
    cube = new Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.position.set(0, 5, 0);

    legGeometry = new CubeGeometry(1, 3, 1);
    leg = new Mesh(legGeometry, legMaterial);
    leg.castShadow = true;
    leg.receiveShadow = true;
    leg.position.set(0.8, -3, 0);

    leg2 = new Mesh(legGeometry, leg2Material);
    leg2.castShadow = true;
    leg2.receiveShadow = true;
    leg2.position.set(-0.8, -3, 0);

    armGeometry = new CubeGeometry(1, 2, 1);
    arm = new Mesh(armGeometry, arm2eMaterial);
    arm.castShadow = true;
    arm.receiveShadow = true;
    arm.position.set(1.5, 0.5, 0);

    arm2 = new Mesh(armGeometry, armeMaterial);
    arm2.castShadow = true;
    arm2.receiveShadow = true;
    arm2.position.set(-1.5, 0.5, 0);

    headGeometry = new CubeGeometry(1, 1, 1);
    head = new Mesh(headGeometry, headMaterial);
    head.castShadow = true;
    head.receiveShadow = true;
    head.position.set(0, 2, 0);



    cube.add(leg);
    cube.add(leg2);
    cube.add(arm2);
    cube.add(arm);
    cube.add(head);

    scene.add(cube);

    console.log("Added Cube Primitive to scene...");
    



    cube.rotation.x += control.rotationSpeedx;
    cube.rotation.y += control.rotationSpeedy;
    cube.rotation.z += control.rotationSpeedz;
    
    





    var render = function () {
                requestAnimationFrame( render );
             
                arm.rotation.x += 0.05;
                arm2.rotation.x += 0.05;
            //renderer.render(scene, camera);
            };

            render();



var cubeGeometry: CubeGeometry;
var armeMaterial: LambertMaterial;
var arm2eMaterial: LambertMaterial;
var legMaterial: LambertMaterial;
var leg2Material: LambertMaterial;
var headMaterial: LambertMaterial;
var cubeMaterial: LambertMaterial;
var head: Mesh;
var leg: Mesh;
var leg2: Mesh;
var arm: Mesh;
var arm2: Mesh;
var legGeometry: CubeGeometry;
var armGeometry: CubeGeometry;
var headGeometry: CubeGeometry;

  gui.addColor(controlObject, 'ambientColour').onChange((color) => { cubeMaterial.color = new Color(color); });
    gui.addColor(controlObject, 'ambientColour').onChange((color) => { legMaterial.color = new Color(color); });
    gui.addColor(controlObject, 'ambientColour').onChange((color) => { leg2Material.color = new Color(color); });
    gui.addColor(controlObject, 'ambientColour').onChange((color) => { arm2eMaterial.color = new Color(color); });
    gui.addColor(controlObject, 'ambientColour').onChange((color) => { armeMaterial.color = new Color(color); });
    gui.addColor(controlObject, 'ambientColour').onChange((color) => { headMaterial.color = new Color(color); });
    /* armeMaterial = new LambertMaterial(ambientColour);
    
    
     // window.addEventListener('resize', onResize, false);
}

function onResize(): void {
    camera.aspect = CScreen.RATIO;
    //camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
}*/ 
//# sourceMappingURL=game.js.map
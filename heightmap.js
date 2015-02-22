'use strict';

// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;

init();
animate();

function init() {
    // SCENE
    scene = new THREE.Scene();

    // CAMERA
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 1000000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0, 1500, 800);
    camera.lookAt(scene.position);

    // RENDERER
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // EVENTS
    THREEx.WindowResize(renderer, camera);

    // CONTROLS
    controls = new THREE.OrbitControls(camera, renderer.domElement);

	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
    container.appendChild( stats.domElement );

    // LIGHT
    var light = new THREE.PointLight(0xffffff);
    light.position.set(100, 250, 100);
    scene.add(light);

    // texture used to generate "bumpiness"
    var bumpTexture = new THREE.ImageUtils.loadTexture('heightmap.png');
    bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;

    // magnitude of normal displacement
    var bumpScale = 200.0;

    // use "this." to create global object
    var customUniforms = {
        bumpTexture: {type: "t", value: bumpTexture},
        bumpScale: {type: "f", value: bumpScale}
    };

    // create custom material from the shader code above
    //   that is within specially labelled script tags
    var customMaterial = new THREE.ShaderMaterial(
        {
            uniforms: customUniforms,
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent
        });

    var planeGeo = new THREE.PlaneBufferGeometry(5000, 5000, 1000, 1000);
    var plane = new THREE.Mesh(planeGeo, customMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 1;
    scene.add(plane);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    update();
}

function update() {
    controls.update();
    stats.update();
}

function render() {
    renderer.render(scene, camera);
}

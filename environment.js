import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
// import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';

import { QSquare } from './qsquare.js'
import { QPiece } from './qpiece.js'
import { QGame } from './qgame.js';

const frustumSize = 48;
const lightHeight = 20;
let lightRadius = 15;
const messageBarHeight = 50;

let container, messageBar;
let camera, scene, raycaster, renderer;
let game;

let newClick = false;
let lights;
let lightAngle = 0;

let pointer = new THREE.Vector2();

function initLights() {
    
    const intensity = 0.5;
    const maxDistance = 0;
    const decay = 2;

    lights = [
        new THREE.PointLight( 0xBBFFBB, intensity, maxDistance, decay ),
        new THREE.PointLight( 0xBBFFBB, intensity, maxDistance, decay ),
        new THREE.PointLight( 0xFFBBBB, intensity, maxDistance, decay ),
        new THREE.PointLight( 0xFFBBBB, intensity, maxDistance, decay ),
        new THREE.PointLight( 0xBBBBFF, intensity, maxDistance, decay ),
        new THREE.PointLight( 0xBBBBFF, intensity, maxDistance, decay )
    ];
    
    for (var i = 0; i < 6; i++) {
        scene.add(lights[i]);
    }

    adjustLightPosition();
}

function adjustLightPosition () {
    lightAngle += 0.005;
    for (var i = 0; i < lights.length; i++) {
        // hopefully this makes the lights move around the board and oscillate up and down
        lights[i].position.set(
            (1+i%2)*lightRadius*Math.cos(lightAngle+i),
            -4+lightHeight*Math.cos(lightAngle+i),
            (1+i%2)*lightRadius*Math.sin(lightAngle+i));
    }
}

function initCamera() {
    const aspect = window.innerWidth / window.innerHeight;

    camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );
    camera.position.x = 32;
    camera.position.y = 48;
    camera.position.z = 32;
}

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xE0E0E0 );

    initLights();
    initCamera();
    
    QPiece.scene = scene;
    QSquare.scene = scene;

    game = new QGame();
    //game.onClickDelegate = ((qp) => { messageBar.innerText = "saw click on " + qp.id; });

    // const axesHelper = new THREE.AxesHelper( 10 );  scene.add( axesHelper );

    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight - messageBarHeight );
    container.appendChild( renderer.domElement );

    messageBar = document.createElement('div');
    messageBar.innerHeight = messageBarHeight;
    container.appendChild(messageBar);

    document.addEventListener( 'click', onClick );
    document.addEventListener( 'keypress', onKey );
    window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {

    const aspect = window.innerWidth / (window.innerHeight - messageBarHeight);

    camera.left = - frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = - frustumSize / 2;
    camera.near = 0;
    camera.far = 96;

    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight - messageBarHeight );
}

function onClick( event ) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / (window.innerHeight - messageBarHeight) ) * 2 + 1;
    newClick = true;
}

function onKey( event ) {
    if (event.code == 'KeyR') {
        game.reset();
    }
}

function render() {
    requestAnimationFrame( render );

    adjustLightPosition();

    camera.lookAt( scene.position );
    camera.updateMatrixWorld();

    if (newClick) {
        raycaster.setFromCamera( pointer, camera );

        const intersects = raycaster.intersectObjects( scene.children, true );

        if ( intersects.length > 0 ) {
            intersects[0].object.userData.qinteractive.onClick();
        }
        newClick = false;
    }

    renderer.render( scene, camera );
}

init();
render();

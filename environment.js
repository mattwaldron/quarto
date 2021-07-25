import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
// import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';

import {QPiece, QColor, QDensity, QHeight, QShape} from './qpiece.js';
import {QBoard} from './qboard.js';
import {QSquare} from './qsquare.js';

const frustumSize = 48;
const pieceSpacing = 7;
const lightHeight = 16;
const squareSize = 5;
const messageBarHeight = 50;

let container, messageBar;
let camera, scene, raycaster, renderer;
let gameBoard;

let newClick = false;
let lightg, lightr, lightb;
let lightAngle = 0;
let lightCenter = squareSize * 2;
let lightRadius = squareSize * 3;
let pointer = new THREE.Vector2();

function initLights() {
    
    const intensity = 0.7;
    const maxDistance = 0;
    const decay = 2;

    lightg = new THREE.PointLight( 0xAAFFAA, intensity, maxDistance, decay );
    scene.add( lightg );

    lightr = new THREE.PointLight( 0xFFAAAA, intensity, maxDistance, decay );
    scene.add( lightr );

    lightb = new THREE.PointLight( 0xAAAAFF, intensity, maxDistance, decay );
    scene.add( lightb );
    adjustLightPosition();
}

function adjustLightPosition () {
    lightAngle += 0.004;
    lightg.position.set( lightCenter + lightRadius*Math.cos(lightAngle), lightHeight, lightCenter + lightRadius*Math.sin(lightAngle) );
    lightr.position.set( lightCenter + lightRadius*Math.cos(lightAngle+2), lightHeight, lightCenter + lightRadius*Math.sin(lightAngle+2) );
    lightb.position.set( lightCenter + lightRadius*Math.cos(lightAngle+4), lightHeight, lightCenter + lightRadius*Math.sin(lightAngle+4) );
}

function initPieces() {
    QPiece.scene = scene;
    QPiece.clickCallback = ((qp) => {
        messageBar.innerText = "saw click on " + qp.id;
    });

    var boardCenter = squareSize*1.5;
    var pRadius = squareSize*3.5;
    var pCount = 0;
    var pStep = 5;
    for (var h in QHeight) {
        for (var s in QShape) {
            for (var d in QDensity) {
                for (var c in QColor) {
                    var x = boardCenter + pRadius*Math.cos(2*Math.PI*pCount*pStep/16);
                    var y = boardCenter + pRadius*Math.sin(2*Math.PI*pCount*pStep/16);
                    new QPiece(QHeight[h], QShape[s], QDensity[d], QColor[c], x, y);
                    pCount += 1;
                }
            }
        }
    }
}

function initBoard() {
    QSquare.scene = scene;
    QSquare.squareSize = squareSize;
    QSquare.clickCallback = ((qs) => {
        messageBar.innerText = "saw click on " + qs.id;
    });
    gameBoard = new QBoard();
}

function initCamera() {
    const aspect = window.innerWidth / window.innerHeight;

    camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );
    camera.position.x = 6*pieceSpacing;
    camera.position.y = 64;
    camera.position.z = 6*pieceSpacing;
}

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );

    initCamera();
    initLights();
    initPieces();
    initBoard();

    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight - messageBarHeight );
    container.appendChild( renderer.domElement );

    messageBar = document.createElement('div');
    messageBar.innerHeight = messageBarHeight;
    container.appendChild(messageBar);

    document.addEventListener( 'click', onClick );
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
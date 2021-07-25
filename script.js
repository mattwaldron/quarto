import * as THREE from "./node_modules/three/build/three.module.js"
import {GLTFLoader} from "./node_modules/three/examples/jsm/loaders/GLTFLoader.js"

const scene = new THREE.Scene();
const loader = new GLTFLoader();

loader.load("./models/tall_round.gltf", function(gltf) {
  scene.add(gltf.scene);
}, undefined, function(err) {
  console.error(err);
});

function allowDrop(ev) {
  ev.preventDefault();
}

function dragStart(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function dragDrop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}
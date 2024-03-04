import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

// debug
const container = document.getElementsByClassName('container')[0];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 30, container.offsetWidth / container.offsetHeight );
camera.position.set( 8, 0, 0 );
camera.lookAt( scene.position );

const renderer = new THREE.WebGLRenderer( {antialias: true, alpha: true} );
renderer.setClearColor( 0x000000, 0 );
renderer.setSize( container.offsetWidth, container.offsetHeight );
renderer.setAnimationLoop( (t) => {
    controls.update( );
    light.position.copy( camera.position );
    renderer.render( scene, camera );
} );

container.appendChild( renderer.domElement );

window.addEventListener( "resize", (event) => {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix( );
    renderer.setSize( container.offsetWidth, container.offsetHeight );
});

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.autoRotate = true;

renderer.outputColorSpace  = THREE.LinearSRGBColorSpace;

const light = new THREE.DirectionalLight( 'white', 3 );
scene.add( light );

const loader = new STLLoader();
loader.load('./flagarm.stl', (geometry) => {
    const material = new THREE.MeshPhongMaterial({ color: 0xffcccc }); // Adjust material as needed
    const mesh = new THREE.Mesh(geometry, material);

    var box = new THREE.Box3().setFromObject( mesh );
    var center = new THREE.Vector3();
    box.getCenter( center );
    mesh.position.sub( center ); // center the model
    // mesh.rotation.y = Math.PI;   // rotate the model

    // const boundingBox = new THREE.Box3();
    // boundingBox.setFromObject(mesh);
    // const center = new THREE.Vector3(
    //     (boundingBox.min.x + boundingBox.max.x) / 2,
    //     (boundingBox.min.y + boundingBox.max.y) / 2,
    //     (boundingBox.min.z + boundingBox.max.z) / 2
    // );
    // mesh.position.copy(center);

    scene.add(mesh);
});
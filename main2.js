import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, scene, renderer, controls;

init();
animate();

function init() {
    scene = new THREE.Scene();

    var axisHelper = new THREE.AxesHelper(100);
    scene.add(axisHelper);


    // add light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 2, 10);

    scene.add(directionalLight);


    // add a camera
    camera = new THREE.PerspectiveCamera(
        50, // fov — Camera frustum vertical field of view.
        window.innerWidth / window.innerHeight, // aspect — Camera frustum aspect ratio.
        1, // near — Camera frustum near plane.
        2000 // far — Camera frustum far plane.
    );
    camera.position.z = 10;
    camera.position.y = 10;
    camera.position.x = 10;








    // define the renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // append the rendered to the dom
    document.body.appendChild(renderer.domElement);


    controls = new OrbitControls(camera, renderer.domElement);
    // controls.autoRotate=true

    controls.update();






    // render the scene
    renderer.render(scene, camera);

    window.addEventListener("resize", onWindowResize);
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}



const loader = new GLTFLoader();

loader.load(
    // './flagarm.gltf',
    './model.gltf',
    // 'tractor.glb',
    (gltf=>{

        const mesh = gltf.scene;

        // Calculate the bounding box of the entire group
        const groupBoundingBox = new THREE.Box3().setFromObject(mesh);

    

        const size = new THREE.Vector3();
        groupBoundingBox.getSize(size);

        // Calculate the scaling factor for model
        const target_size =10;
        const scale = target_size / size.length();
        mesh.scale.set(scale, scale, scale);

        const newgroupBoundingBox = new THREE.Box3().setFromObject(mesh);
        const groupCenter = new THREE.Vector3();
        newgroupBoundingBox.getCenter(groupCenter);

        // Move the group so that its center is at the scene's origin
        mesh.position.sub(groupCenter);

        scene.add(mesh);
}))


/*
loader.load('./flagarm.gltf',
    function (gltf) {
        const mesh = gltf.scene;
       
        const scaleValue = 0.04;
        mesh.scale.set(scaleValue, scaleValue, scaleValue);

        // Calculate the bounding box of the entire group
        const groupBoundingBox = new THREE.Box3().setFromObject(mesh);

        // Calculate the center of the group's bounding box
        const groupCenter = new THREE.Vector3();
        groupBoundingBox.getCenter(groupCenter);

        // Move the group so that its center is at the scene's origin
        mesh.position.sub(groupCenter);

        scene.add(mesh);
    },

);
*/


document.getElementById("app").innerHTML = `
  <h1>Basic Three js</h1>
`;

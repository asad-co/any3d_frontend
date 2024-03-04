import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

async function decryptData(encryptedData, iv, encryptionKey) {
    // Convert IV and encrypted data from hex strings to Uint8Arrays
    const ivArray = hexStringToUint8Array(iv);
    const encryptedDataArray = hexStringToUint8Array(encryptedData);

    // Import the encryption key
    const importedKey = await window.crypto.subtle.importKey(
        'raw',
        hexStringToUint8Array(encryptionKey),
        { name: 'AES-CBC' },
        false,
        ['decrypt']
    );

    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
        {
            name: 'AES-CBC',
            iv: ivArray,
        },
        importedKey,
        encryptedDataArray
    );

    // Convert the decrypted data to a string
    const decryptedString = new TextDecoder().decode(decryptedData);

    return decryptedString;
}

function hexStringToUint8Array(hexString) {
    return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}


const getModel = async () => {

    const url = 'http://localhost:8000/api/loadmodel/'
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
           
        },
    })



    const data = await response.json();


    const realData=await decryptData(data.encryptedData,data.iv,data.key)

    
    console.log(typeof realData)
    console.log({realData})

    const newdata =  JSON.parse(realData)

    console.log(typeof newdata)
    console.log({newdata})

    // console.log(typeof data)
    // console.log({data})


    const sceneData = JSON.parse(newdata);
    // const sceneData = JSON.parse(data.scene);

    
    console.log(typeof sceneData)
    console.log({sceneData})
    
    const scene = new THREE.ObjectLoader().parse(sceneData);

    console.log({scene})
    // add a camera
    const camera = new THREE.PerspectiveCamera(
        50, // fov — Camera frustum vertical field of view.
        window.innerWidth / window.innerHeight, // aspect — Camera frustum aspect ratio.
        1, // near — Camera frustum near plane.
        2000 // far — Camera frustum far plane.
    );
    camera.position.z = 10;
    camera.position.y = 10;
    camera.position.x = 10;


    // Add the scene to your HTML document
    const container = document.getElementById('app');


    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);



    container.appendChild(renderer.domElement);


    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.autoRotate=true

    controls.update();

    // Render the scene
    const animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera); // Don't forget to define 'camera'
    };

    const onWindowResize=()=> {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", onWindowResize);
    animate();
}

getModel();
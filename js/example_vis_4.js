import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera, scene, renderer, model, controls;
let isUserInteracting = false;
const clock = new THREE.Clock();

init();

function init() {
    // const container = document.createElement('div');
    // const container = document.getElementById('three-container-4');
    const container = document.getElementById('example-container-4');

    // document.body.appendChild(container);
 
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.25, 100000);
    camera.position.set(2.5 , 4.5 , 2.5);

    scene = new THREE.Scene();
    scene.background = new THREE.Color("#ffffff");

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    // const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0);
    // directionalLight3.position.set(0, 0, -5);
    // scene.add(directionalLight3);

    // axis helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // tiny mesh
    // const geometry = new THREE.SphereGeometry(1, 32, 32);
    // const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    // const sphere = new THREE.Mesh(geometry, material);
    // sphere.position.set(-3, 0, 0);
    // scene.add(sphere);

    const loader = new GLTFLoader().setPath('public/scene0050_00_merged/');
    loader.load('model.gltf', async function(gltf) {
        model = gltf.scene;
        // model.position.set(0.2, 0.2, 0.2)
        model.rotation.set(-Math.PI / 2, 0, Math.PI);
        await renderer.compileAsync(model, camera, scene);
        scene.add(model);
    });

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth / 3, window.innerHeight / 3);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);


    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 10;

    controls.target.set(0, 0, -0.2);
    controls.update();

    window.addEventListener('resize', onWindowResize);
    render();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    const delta = clock.getDelta();
    if (!isUserInteracting && model) {
        model.rotation.z -= 0.002;
    }
    controls.update(); 
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

controls.addEventListener('change', () => {
    isUserInteracting = true;
});

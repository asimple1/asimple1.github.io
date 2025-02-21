import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera, scene, renderer, model, controls;
let isUserInteracting = false;
const clock = new THREE.Clock(); // 用来跟踪时间，以便更新动画

init();

function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    // 创建相机
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.25, 100000);
    camera.position.set(30, 30, 30);

    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#88B9DD");

    // 添加光源
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

    // 加载GLTF模型
    // const loader = new GLTFLoader().setPath('my_handcrafted_gltf/');
    const loader = new GLTFLoader().setPath('my_handcrafted_gltf_merged/');
    loader.load('model.gltf', async function(gltf) {
        model = gltf.scene;
        model.rotation.set(-Math.PI / 2, 0, Math.PI);
        await renderer.compileAsync(model, camera, scene);
        scene.add(model);
    });

    // 创建WebGL渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);

    // 创建控制器
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // 开启阻尼
    controls.dampingFactor = 0.2; // 设置阻尼强度，值越大，旋转越慢
    controls.screenSpacePanning = false; // 禁用屏幕平移
    controls.minDistance = 2;
    controls.maxDistance = 10;

    controls.target.set(0, 0, -0.2);
    controls.update(); // 更新控制器

    // 监听窗口大小变化
    window.addEventListener('resize', onWindowResize);
    // 启动渲染
    render();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    // 获取时间差
    const delta = clock.getDelta();

    // 自动旋转
    if (!isUserInteracting && model) {
        model.rotation.z -= 0.002; // 控制旋转速度
    }

    // 更新控制器，确保平滑过渡
    controls.update(); 

    // 渲染场景
    renderer.render(scene, camera);

    // 继续下一帧
    requestAnimationFrame(render);
}

// 判断用户是否正在交互
controls.addEventListener('change', () => {
    isUserInteracting = true;
});

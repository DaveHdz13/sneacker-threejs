import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Renderer
const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f172a);

// Camera
const camera = new THREE.PerspectiveCamera(
    50, 
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.set(2, 2, 3);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(3, 5, 2);
scene.add(directionalLight);

// Mesh (placeholder for sneaker model)
const geometry = new THREE.BoxGeometry(1, 0.5, 2);
const material = new THREE.MeshStandardMaterial({
    color: 0xff7b00,
    roughness: 0.4,
    metalness: 0.1
})
const shoe = new THREE.Mesh(geometry, material);
shoe.rotation.y = Math.PI * 0.25;
scene.add(shoe);

// Ground plane
const planeGo = new THREE.CircleGeometry(2, 64);
const planeMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.8,
    metalness: 0.0
});
const plane = new THREE.Mesh(planeGo, planeMat);
plane.rotation.x = - Math.PI * 2.5;
plane.position.y = -0.3;
scene.add(plane);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0.1, 0);

// Resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
})

// Loop
function animate() {
    requestAnimationFrame(animate);

    shoe.rotation.y += 0.002;
    controls.update();
    renderer.render(scene, camera);
}
animate();
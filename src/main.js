import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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
/* const material = new THREE.MeshStandardMaterial({
    color: 0xff7b00,
    roughness: 0.4,
    metalness: 0.1
})
const shoe = new THREE.Mesh(geometry, material);
shoe.rotation.y = Math.PI * 0.25;
scene.add(shoe); */

// Load sneaker model
let sneaker = null;
const sneakerMaterials = [];
const textureLoader = new THREE.TextureLoader();
const colorVariants = {};
let originalDiffuseMap = null; // will come from the GLB

colorVariants.cyan  = textureLoader.load('/models/texture_diffuse_cyan.png');
colorVariants.green = textureLoader.load('/models/texture_diffuse_green.png');
colorVariants.red   = textureLoader.load('/models/texture_diffuse_red.png');

// Make them compatible with GLTF UVs
Object.values(colorVariants).forEach((tex) => {
  tex.flipY = false;
});

const loader = new GLTFLoader();
loader.load(
    '/models/sneaker.glb',
    (gltf) => {
        const model = gltf.scene;

        model.position.set(0, -0.2, 0);
        model.scale.set(1, 1, 1);
        model.rotation.y = Math.PI * 0.25;

        scene.add(model);
        sneaker = model;

        model.traverse((child) => {
            if (child.isMesh && child.material) {
                const mat = child.material;

                // Save reference to materials so we can swap their map later
                sneakerMaterials.push(mat);

                // Grab the original diffuse map once and use it as the "yellow" variant
                if (!originalDiffuseMap && mat.map) {
                    originalDiffuseMap = mat.map;
                    colorVariants.yellow = originalDiffuseMap;
                }
            }
        });
        
        // Optional: start with yellow explicitly
        setSneakerVariant('yellow');
        console.log('Sneaker materials:', sneakerMaterials);
        console.log("Model loaded: ", model);
    },
    /* (progress) => {
        console.log(`Loading model... ${(progress.loaded / progress.total) * 100}%`);
    }, */
    /* (error) => {
        console.error("Error loading model:", error);
    } */
);

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

    // shoe.rotation.y += 0.002;
    if (sneaker) {
        sneaker.rotation.y += 0.002;
    }
    controls.update();
    renderer.render(scene, camera);
}
animate();

// UI - Color change
function setSneakerVariant(variantKey) {
  const tex = colorVariants[variantKey];
  if (!tex) return;

  sneakerMaterials.forEach((mat) => {
    mat.map = tex;
    mat.needsUpdate = true;
  });
}


const buttons = document.querySelectorAll('.ui button');

buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const variant = btn.getAttribute('data-variant');
    setSneakerVariant(variant);
  });
});

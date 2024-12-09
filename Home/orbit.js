
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(1300, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.5;
renderer.shadowMap.enabled = true;


// Scene
const scene = new THREE.Scene();
// Create a gradient on a canvas element
const canvas1 = document.createElement('canvas');
const ctx = canvas1.getContext('2d');
canvas1.width = 512;
canvas1.height = 512;

// Create a linear gradient from top to bottom
const gradient = ctx.createLinearGradient(0, 0, 0, canvas1.height);
gradient.addColorStop(0.2,  '#050505ee'); // Starting color
gradient.addColorStop(0.6,  '#050505e8'); // Starting color
gradient.addColorStop(0.4,  '#050505e8'); // Starting color
gradient.addColorStop(0.8,  '#050505e8'); // Starting color
gradient.addColorStop(1,  '#050505ee'); // Starting color
/* gradient.addColorStop(0.8, '#527801'); // Ending color */

// Set the gradient as the fill style
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas1.width, canvas1.height);

// Create a texture from the canvas1
const texture = new THREE.CanvasTexture(canvas1);

// Set the scene's background to the texture (this gives a gradient effect)
scene.background = texture;


// Camera
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 3.2, 11.5);
scene.add(camera);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(10, 15, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 15, 0);
spotLight.angle = Math.PI / 6;
spotLight.castShadow = true;
scene.add(spotLight);

// Orbit Controls
/* const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; */

// Parameters
const orbitRadius = 7;
const modelSize = 1.8; // Standard size for other models
const targetPosition = new THREE.Vector3(0.000002287564276892695, 0, 6.999999999999626); // Target position
const targetSize = modelSize * 1.5; // Increase size for the model at target position
const tolerance = 0.05; // Tolerance for comparing positions
const numModels = 8;

// Parent object for models
const orbitGroup = new THREE.Object3D();
scene.add(orbitGroup);

// GLTF Loader and Model Loading
const gltfLoader = new GLTFLoader();
const angleStep = (2 * Math.PI) / numModels;
let currentModelIndex = 0; // Tracks the current model in front of the camera

const models = []; // Store models for later access

for (let i = 0; i < numModels; i++) {
  gltfLoader.load('Home/models/T_shirt_gltf.zip.gltf', (gltf) => {
    const model = gltf.scene.children[0];
    const angle = i * angleStep;

    model.position.set(
      orbitRadius * Math.cos(angle),
      0,
      orbitRadius * Math.sin(angle)
    );

    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32),
      new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
    );
    pedestal.position.set(
      model.position.x,
      1.8,
      model.position.z
    );
    pedestal.receiveShadow = true;

    model.scale.set(modelSize, modelSize, modelSize); // Normal size for all models
    model.castShadow = true;

    orbitGroup.add(model);
    orbitGroup.add(pedestal);

    models.push(model); // Store the model for future reference

    // Log the position of each model
    console.log(`Model ${i} position:`, model.position);
  });
}

// Add grid helper
/* const gridHelper = new THREE.GridHelper(20, 20);
scene.add(gridHelper);

// Add axes helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper); */

// Animation loop
// Animation loop
function draw() {
  // Update models' size based on position
  models.forEach(model => {
    const worldPosition = model.getWorldPosition(new THREE.Vector3());

    // Check if the model is close to the target position
    if (worldPosition.distanceTo(targetPosition) < tolerance) {
      model.scale.set(targetSize + 0.2, targetSize  , targetSize +0.2 ); // Scale the model at the target position
      
      // Rotate the model in the opposite direction of orbitGroup
      model.rotation.y= -orbitGroup.rotation.y; // Apply opposite rotation
    } else {
      model.scale.set(modelSize, modelSize, modelSize); // Reset size for other models
    }
  });

  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}


// Resize handler
function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Calculate target rotation for a given model index
function rotateToModel(index) {
  const targetRotation = -index * angleStep; // Calculate target rotation
  gsap.to(orbitGroup.rotation, {
    y: targetRotation,
    duration: 1, // Smooth animation duration
    ease: 'power2.inOut', // Easing function
  });
}

// Buttons for Navigation
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

leftButton.addEventListener('click', () => {
  currentModelIndex =
    (currentModelIndex - 1 + numModels) % numModels; // Cycle backward
  rotateToModel(currentModelIndex);
});


rightButton.addEventListener('click', () => {
  currentModelIndex = (currentModelIndex + 1) % numModels; // Cycle forward
  rotateToModel(currentModelIndex);
});

// Event listeners
window.addEventListener('resize', setSize);

// Start animation loop
draw(); 































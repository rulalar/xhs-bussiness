import * as THREE from '../lib/three.module.js';
import { OrbitControls } from '../lib/OrbitControls.js';

// 场景、相机和渲染器设置
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 设置相机位置
camera.position.set(0, 0, 20);
controls.update();

// 添加环境光和方向光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// 创建小球几何体
const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);

// 存储所有小球的数组
let particles = [];
let currentDistribution = 'sphere';
let particleCount = 300;
let colorMode = 'white';

// 获取随机颜色
function getRandomColor() {
    if (colorMode === 'white') {
        return new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.3,
            metalness: 0.2,
            emissive: 0x111111
        });
    } else {
        const hue = Math.random();
        const saturation = 0.5;
        const lightness = 0.7;
        return new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(hue, saturation, lightness),
            roughness: 0.3,
            metalness: 0.2,
            emissive: new THREE.Color().setHSL(hue, saturation, 0.1)
        });
    }
}

// 清除所有现有粒子
function clearParticles() {
    for (let particle of particles) {
        scene.remove(particle);
    }
    particles = [];
}

// 在球体表面生成粒子
function createSphericalDistribution(count = particleCount) {
    clearParticles();
    currentDistribution = 'sphere';
    
    for (let i = 0; i < count; i++) {
        // 均匀分布在球面上的算法
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = 2 * Math.PI * Math.random();
        
        const x = 10 * Math.sin(phi) * Math.cos(theta);
        const y = 10 * Math.sin(phi) * Math.sin(theta);
        const z = 10 * Math.cos(phi);
        
        const material = getRandomColor();
        const mesh = new THREE.Mesh(sphereGeometry, material);
        mesh.position.set(x, y, z);
        scene.add(mesh);
        particles.push(mesh);
    }
}

// 在立方体表面/内部生成粒子
function createCubicDistribution(count = particleCount) {
    clearParticles();
    currentDistribution = 'cube';
    
    const size = 10;
    const half = size / 2;
    
    for (let i = 0; i < count; i++) {
        // 随机选择一个面
        const face = Math.floor(Math.random() * 6);
        let x, y, z;
        
        switch (face) {
            case 0: // 正面 x = half
                x = half;
                y = Math.random() * size - half;
                z = Math.random() * size - half;
                break;
            case 1: // 背面 x = -half
                x = -half;
                y = Math.random() * size - half;
                z = Math.random() * size - half;
                break;
            case 2: // 上面 y = half
                x = Math.random() * size - half;
                y = half;
                z = Math.random() * size - half;
                break;
            case 3: // 下面 y = -half
                x = Math.random() * size - half;
                y = -half;
                z = Math.random() * size - half;
                break;
            case 4: // 右面 z = half
                x = Math.random() * size - half;
                y = Math.random() * size - half;
                z = half;
                break;
            case 5: // 左面 z = -half
                x = Math.random() * size - half;
                y = Math.random() * size - half;
                z = -half;
                break;
        }
        
        const material = getRandomColor();
        const mesh = new THREE.Mesh(sphereGeometry, material);
        mesh.position.set(x, y, z);
        scene.add(mesh);
        particles.push(mesh);
    }
}

// 在环面上生成粒子
function createTorusDistribution(count = particleCount) {
    clearParticles();
    currentDistribution = 'torus';
    
    const R = 10; // 环面主半径
    const r = 3;  // 环面管半径
    
    for (let i = 0; i < count; i++) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        
        const x = (R + r * Math.cos(v)) * Math.cos(u);
        const y = (R + r * Math.cos(v)) * Math.sin(u);
        const z = r * Math.sin(v);
        
        const material = getRandomColor();
        const mesh = new THREE.Mesh(sphereGeometry, material);
        mesh.position.set(x, y, z);
        scene.add(mesh);
        particles.push(mesh);
    }
}

// 重新生成当前分布
function regenerateCurrentDistribution() {
    switch (currentDistribution) {
        case 'sphere':
            createSphericalDistribution();
            break;
        case 'cube':
            createCubicDistribution();
            break;
        case 'torus':
            createTorusDistribution();
            break;
    }
}

// 初始化默认为球面分布
createSphericalDistribution();

// 添加按钮事件监听器
document.getElementById('sphere').addEventListener('click', () => createSphericalDistribution());
document.getElementById('cube').addEventListener('click', () => createCubicDistribution());
document.getElementById('torus').addEventListener('click', () => createTorusDistribution());

// 添加控制界面
const controlsDiv = document.querySelector('.controls');

// 添加粒子数量控制
const countControl = document.createElement('div');
countControl.innerHTML = `
    <label for="particleCount" style="color: white; margin-right: 10px;">粒子数量:</label>
    <input type="range" id="particleCount" min="50" max="1000" value="300" style="width: 100px;">
    <span id="countValue" style="color: white; margin-left: 10px;">300</span>
`;
controlsDiv.appendChild(countControl);

const countSlider = document.getElementById('particleCount');
const countValue = document.getElementById('countValue');
countSlider.addEventListener('input', (e) => {
    particleCount = parseInt(e.target.value);
    countValue.textContent = particleCount;
    regenerateCurrentDistribution();
});

// 添加颜色模式开关
const colorToggle = document.createElement('div');
colorToggle.innerHTML = `
    <button id="colorToggle" style="margin-top: 10px;">切换颜色模式</button>
`;
controlsDiv.appendChild(colorToggle);

document.getElementById('colorToggle').addEventListener('click', () => {
    colorMode = colorMode === 'white' ? 'random' : 'white';
    regenerateCurrentDistribution();
});

// 添加窗口大小调整事件监听
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
});

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    
    // 微小旋转所有粒子，增加动态效果
    particles.forEach(particle => {
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.01;
    });
    
    controls.update();
    renderer.render(scene, camera);
}

animate(); 
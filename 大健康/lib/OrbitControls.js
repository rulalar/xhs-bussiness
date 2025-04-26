import * as THREE from './three.module.js';

/**
 * OrbitControls 允许相机围绕目标轨道运行
 * 简化版本仅包含基本功能
 */
class OrbitControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        
        // 设置默认值
        this.target = new THREE.Vector3();
        this.enableDamping = false;
        this.dampingFactor = 0.05;
        
        // 事件处理
        this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.domElement.addEventListener('wheel', this.onMouseWheel.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        
        this.rotateStart = new THREE.Vector2();
        this.rotateEnd = new THREE.Vector2();
        this.rotateDelta = new THREE.Vector2();
        
        this.isMouseDown = false;
        
        // 初始化
        this.update();
    }
    
    onMouseDown(event) {
        this.isMouseDown = true;
        this.rotateStart.set(event.clientX, event.clientY);
    }
    
    onMouseMove(event) {
        if (!this.isMouseDown) return;
        
        this.rotateEnd.set(event.clientX, event.clientY);
        this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
        
        // 旋转相机
        const element = this.domElement;
        
        // 旋转角度 (简化版本)
        const rotateSpeed = 0.002;
        const thetaDelta = -this.rotateDelta.x * rotateSpeed;
        const phiDelta = -this.rotateDelta.y * rotateSpeed;
        
        // 更新相机位置 (简化版本)
        const position = this.camera.position.clone();
        position.sub(this.target);
        
        // 水平旋转
        let theta = Math.atan2(position.x, position.z);
        theta += thetaDelta;
        
        // 垂直旋转
        let phi = Math.atan2(Math.sqrt(position.x * position.x + position.z * position.z), position.y);
        phi += phiDelta;
        phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi));
        
        // 更新相机位置
        const radius = position.length();
        position.x = radius * Math.sin(phi) * Math.sin(theta);
        position.y = radius * Math.cos(phi);
        position.z = radius * Math.sin(phi) * Math.cos(theta);
        
        position.add(this.target);
        this.camera.position.copy(position);
        this.camera.lookAt(this.target);
        
        this.rotateStart.copy(this.rotateEnd);
    }
    
    onMouseUp() {
        this.isMouseDown = false;
    }
    
    onMouseWheel(event) {
        // 缩放
        const zoomScale = 0.95;
        if (event.deltaY > 0) {
            this.dollyOut(zoomScale);
        } else {
            this.dollyIn(zoomScale);
        }
        
        this.update();
    }
    
    dollyIn(dollyScale) {
        // 放大
        const position = this.camera.position.clone();
        position.sub(this.target);
        position.multiplyScalar(dollyScale);
        position.add(this.target);
        this.camera.position.copy(position);
    }
    
    dollyOut(dollyScale) {
        // 缩小
        const position = this.camera.position.clone();
        position.sub(this.target);
        position.multiplyScalar(1 / dollyScale);
        position.add(this.target);
        this.camera.position.copy(position);
    }
    
    update() {
        // 应用阻尼效果等
        this.camera.lookAt(this.target);
    }
}

export { OrbitControls }; 
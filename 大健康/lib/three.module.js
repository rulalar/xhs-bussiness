// Three.js r132 - https://github.com/mrdoob/three.js
var THREE = { REVISION: '132' };

// 基础类
THREE.EventDispatcher = function () {};
THREE.Math = { DEG2RAD: Math.PI / 180, RAD2DEG: 180 / Math.PI };
THREE.Vector2 = function (x, y) { this.x = x || 0; this.y = y || 0; };
THREE.Vector3 = function (x, y, z) { this.x = x || 0; this.y = y || 0; this.z = z || 0; };
THREE.Vector4 = function (x, y, z, w) { this.x = x || 0; this.y = y || 0; this.z = z || 0; this.w = w || 0; };
THREE.Color = function (r, g, b) {
    this.r = 1; this.g = 1; this.b = 1;
    if (g === undefined && b === undefined) {
        return this.set(r);
    }
    return this.setRGB(r, g, b);
};

THREE.Color.prototype = {
    constructor: THREE.Color,
    set: function (value) {
        if (value && value.isColor) {
            this.r = value.r;
            this.g = value.g;
            this.b = value.b;
        }
        return this;
    },
    setRGB: function (r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        return this;
    },
    setHSL: function (h, s, l) {
        // 简化版HSL转RGB
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        
        h = h % 1;
        s = Math.max(0, Math.min(1, s));
        l = Math.max(0, Math.min(1, l));
        
        if (s === 0) {
            this.r = this.g = this.b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            this.r = hue2rgb(p, q, h + 1/3);
            this.g = hue2rgb(p, q, h);
            this.b = hue2rgb(p, q, h - 1/3);
        }
        
        return this;
    }
};

// 简化版场景类
THREE.Scene = function () {
    this.children = [];
};

THREE.Scene.prototype = {
    constructor: THREE.Scene,
    add: function (object) {
        this.children.push(object);
        return this;
    },
    remove: function (object) {
        const index = this.children.indexOf(object);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }
};

// 相机
THREE.PerspectiveCamera = function (fov, aspect, near, far) {
    this.fov = fov || 50;
    this.aspect = aspect || 1;
    this.near = near || 0.1;
    this.far = far || 2000;
    this.position = new THREE.Vector3();
    this.updateProjectionMatrix();
};

THREE.PerspectiveCamera.prototype = {
    constructor: THREE.PerspectiveCamera,
    updateProjectionMatrix: function () {
        // 简化版，实际应用中需要更复杂的矩阵计算
    }
};

// 渲染器
THREE.WebGLRenderer = function (parameters) {
    parameters = parameters || {};
    this.domElement = document.createElement('canvas');
    this.context = this.domElement.getContext('webgl') || this.domElement.getContext('experimental-webgl');
};

THREE.WebGLRenderer.prototype = {
    constructor: THREE.WebGLRenderer,
    setSize: function (width, height) {
        this.domElement.width = width;
        this.domElement.height = height;
        return this;
    },
    setPixelRatio: function (value) {
        this.pixelRatio = value;
        return this;
    },
    render: function (scene, camera) {
        // 简化版渲染逻辑
    }
};

// 几何体
THREE.SphereGeometry = function (radius, widthSegments, heightSegments) {
    this.radius = radius || 1;
    this.widthSegments = widthSegments || 8;
    this.heightSegments = heightSegments || 6;
};

// 材质
THREE.MeshStandardMaterial = function (parameters) {
    parameters = parameters || {};
    this.color = parameters.color !== undefined ? new THREE.Color(parameters.color) : new THREE.Color(0xffffff);
    this.roughness = parameters.roughness !== undefined ? parameters.roughness : 0.5;
    this.metalness = parameters.metalness !== undefined ? parameters.metalness : 0.5;
    this.emissive = parameters.emissive !== undefined ? new THREE.Color(parameters.emissive) : new THREE.Color(0x000000);
};

// Mesh
THREE.Mesh = function (geometry, material) {
    this.geometry = geometry;
    this.material = material;
    this.position = new THREE.Vector3();
    this.rotation = new THREE.Vector3();
};

// 光源
THREE.AmbientLight = function (color, intensity) {
    this.color = new THREE.Color(color);
    this.intensity = intensity !== undefined ? intensity : 1;
};

THREE.DirectionalLight = function (color, intensity) {
    this.color = new THREE.Color(color);
    this.intensity = intensity !== undefined ? intensity : 1;
    this.position = new THREE.Vector3(0, 1, 0);
};

export default THREE;
export { THREE }; 
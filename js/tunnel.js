let sphere, tunnelActive = false;
let tunnelRings = [];
let tunnelRotationSpeed = 0.01; // 新增：隧道旋转速度变量
let photos = [
    // 照片路径可以替换为实际图片路径
    'assets/photos/a(1).jpg',
    'assets/photos/a(2).jpg',
    'assets/photos/a(3).jpg', // 修复：添加缺失的逗号
    'assets/photos/a(4).jpg',
    'assets/photos/a(5).jpg',
    'assets/photos/a(6).jpg'
];

function initTunnel() {
    // 创建主要球体
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x4ECDC4, // 柔和的天蓝色
        wireframe: true
    });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    
    // 添加点击事件监听
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    window.addEventListener('click', (event) => {
        // 计算鼠标位置归一化坐标
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // 更新射线投射器
        raycaster.setFromCamera(mouse, camera);
        
        // 检查与球体的交集
        const intersects = raycaster.intersectObject(sphere);
        if (intersects.length > 0) {
            toggleTunnel();
        }
    });

    // 新增：鼠标移动控制隧道旋转速度
    window.addEventListener('mousemove', (event) => {
        // 根据鼠标X轴位置调整旋转速度（范围：0.005 ~ 0.02）
        const speedFactor = (event.clientX / window.innerWidth) * 0.015 + 0.005;
        tunnelRotationSpeed = speedFactor;
    });
}

function toggleTunnel() {
    tunnelActive = !tunnelActive;
    
    if (tunnelActive) {
        createTunnel();
    } else {
        removeTunnel();
    }
}

function createTunnel() {
    // 创建隧道环
    for (let i = 0; i < 30; i++) {
        const ringGeometry = new THREE.RingGeometry(1 + i * 0.2, 1.2 + i * 0.2, 32);
        
        // 为每3个环添加一个照片纹理
        let material;
        if (i % 3 === 0 && photos[i/3]) {
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(photos[i/3]);
            material = new THREE.MeshBasicMaterial({ 
                map: texture,
                side: THREE.DoubleSide,
                transparent: true
            });
        } else {
            material = new THREE.MeshBasicMaterial({ 
                color: 0x00ffff, 
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7
            });
        }
        
        const ring = new THREE.Mesh(ringGeometry, material);
        ring.position.z = -i * 1; // 沿Z轴排列
        scene.add(ring);
        tunnelRings.push(ring);
    }
}

function removeTunnel() {
    tunnelRings.forEach(ring => {
        scene.remove(ring);
    });
    tunnelRings = [];
}

// 修改：隧道动画逻辑
function animateTunnel() {
    // 移除单独的requestAnimationFrame，由stars.js统一驱动
    // requestAnimationFrame(animateTunnel);
    
    // 球体旋转
    if (sphere) {
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
    }
    
    // 隧道动画
    if (tunnelActive) {
        tunnelRings.forEach((ring) => {
            // 使用动态旋转速度
            ring.rotation.x += tunnelRotationSpeed;
            ring.rotation.y += tunnelRotationSpeed;
            // 让隧道有移动效果
            ring.position.z += 0.1;
            if (ring.position.z > 5) {
                ring.position.z = -30;
            }
        });
    }
}

// 移除单独启动的动画，由stars.js统一管理
// animateTunnel();
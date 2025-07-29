// 星星颜色修改
document.getElementById('star-color').addEventListener('input', (e) => {
    const color = new THREE.Color(e.target.value);
    stars.forEach(star => {
        star.material.color.copy(color);
    });
});

// 隧道颜色修改
document.getElementById('tunnel-color').addEventListener('input', (e) => {
    const color = new THREE.Color(e.target.value);
    tunnelRings.forEach(ring => {
        // 只修改非照片材质的隧道环
        if (!ring.material.map) {
            ring.material.color.copy(color);
        }
    });
});

// 上传照片替换隧道纹理
document.getElementById('photo-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(event.target.result);
        // 替换隧道中所有照片环的纹理
        tunnelRings.forEach((ring, index) => {
            if (index % 3 === 0) {
                ring.material.map = texture;
                ring.material.needsUpdate = true; // 强制材质更新
            }
        });
    };
    reader.readAsDataURL(file);
});
let scene, camera, renderer, stars = [];
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

// 内容数据：文字、图片、视频的混合集合
const contentData = [
  // 文字内容
  { type: 'text', value: '爱意多于昨天<br>但远不及明天' },
  { type: 'text', value: '爱本无定义<br>但你是唯一' },
  { type: 'text', value: '小得盈满<br>爱逢其时' },
  { type: 'text', value: '幸福降临昊琪' },
  { type: 'text', value: '187 & yyq 99' },
  { type: 'text', value: '187 & yyq 99' },
  { type: 'text', value: '187 & yyq 99' },
  { type: 'text', value: '我爱你<br>在我每次望向你' },
  // 图片内容
  { type: 'image', value: 'assets/photos/a(1).jpg' },
  { type: 'image', value: 'assets/photos/a(2).jpg' },
  { type: 'image', value: 'assets/photos/a(3).jpg' },
  { type: 'image', value: 'assets/photos/a(4).jpg' },
  { type: 'image', value: 'assets/photos/a(5).jpg' },
  { type: 'image', value: 'assets/photos/a(6).jpg' },
  { type: 'image', value: 'assets/photos/a(7).jpg' },
  { type: 'image', value: 'assets/photos/a(8).jpg' },
  { type: 'image', value: 'assets/photos/a(9).jpg' },
  { type: 'image', value: 'assets/photos/a(10).jpg' },
  { type: 'image', value: 'assets/photos/a(11).jpg' },
  // 视频内容
  { type: 'video', value: 'assets/videos/video1.mp4' },
  { type: 'video', value: 'assets/videos/video2.mp4' },
  { type: 'video', value: 'assets/videos/video3.mp4' }
];
// 星空配色方案集合
const gradients = [
  'var(--starry-gradient)',
  'var(--twilight-gradient)',
  'var(--galaxy-gradient)',
  'var(--aurora-gradient)'
];

function initStars() {
  // 修复背景渐变设置
  const root = document.documentElement;
  const gradientValues = gradients.map(grad => {
    const varName = grad.replace('var(', '').replace(')', '').trim();
    return getComputedStyle(root).getPropertyValue(varName);
  });
  document.body.style.background = gradientValues[Math.floor(Math.random() * gradientValues.length)];

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('scene-container').appendChild(renderer.domElement);

  // 星星颜色（在原有基础上增加黄色、紫色等更多颜色）
const starColors = [
  0xffffff,   // 白色
  0xadd8e6,   // 浅蓝色
  0xffc0cb,   // 粉色
  0xffff00,   // 黄色
  0x9370db,   // 紫色
  0xffa500    // 橙色
];
  
  // 创建星星
  for (let i = 0; i < 1200; i++) {
    const size = Math.random() * 0.1 + 0.02;
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const color = starColors[Math.floor(Math.random() * starColors.length)];
    const material = new THREE.MeshBasicMaterial({ color });
    const star = new THREE.Mesh(geometry, material);

    // 随机位置
    star.position.x = (Math.random() - 0.5) * 40;
    star.position.y = (Math.random() - 0.5) * 40;
    star.position.z = -Math.random() * 40;

    // 存储旋转速度
    star.rotationSpeedX = (Math.random() - 0.5) * 0.01;
    star.rotationSpeedY = (Math.random() - 0.5) * 0.01;

    scene.add(star);
    stars.push(star);
  }

  // 初始化视频容器
  initMediaContainers();

  // 监听鼠标点击
  window.addEventListener('click', onStarClick);
  window.addEventListener('resize', onWindowResize);

  animateStars();
}

// 初始化媒体容器（图片/视频）
function initMediaContainers() {
  // 检查并创建视频容器
  if (!document.getElementById('video-container')) {
    const videoContainer = document.createElement('div');
    videoContainer.id = 'video-container';
    videoContainer.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 600px;
      height: auto;
      border: 3px solid white;
      border-radius: 10px;
      overflow: hidden;
      opacity: 0;
      transition: opacity 0.5s ease;
      z-index: 20;
      pointer-events: none;
    `;
    
    const video = document.createElement('video');
    video.controls = true;
    video.style.width = '100%';
    video.style.height = 'auto';
    videoContainer.appendChild(video);
    
    document.body.appendChild(videoContainer);
  }
}

// 窗口大小调整
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 星星点击事件
function onStarClick(event) {
  // 隐藏所有媒体元素
  hideAllMedia();

  // 计算鼠标位置
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 检测与星星的交集
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(stars);

  if (intersects.length > 0) {
    // 随机选择一个内容
    const randomContent = contentData[Math.floor(Math.random() * contentData.length)];
    
    switch (randomContent.type) {
      case 'text':
        showText(randomContent.value);
        break;
      case 'image':
        showImage(randomContent.value);
        break;
      case 'video':
        showVideo(randomContent.value);
        break;
    }
  }
}

// 显示文字（支持自动换行）
function showText(text) {
    const textEl = document.getElementById('special-text');
    // 可以根据需要手动添加换行符，或让CSS自动处理
    // 例如遇到特定分隔符时换行：text = text.replace(/，/g, '，<br>');
    textEl.innerHTML = text; // 使用innerHTML支持可能的HTML换行
    textEl.style.opacity = 1;
    setTimeout(() => { textEl.style.opacity = 0; }, 3000);
}

// 显示图片
function showImage(src) {
  const photoEl = document.getElementById('photo-container');
  const img = photoEl.querySelector('img');
  img.src = src;
  img.onload = () => {
    photoEl.style.opacity = 1;
    setTimeout(() => { photoEl.style.opacity = 0; }, 5000);
  };
}

// 显示视频（修复播放逻辑+音乐控制）
function showVideo(src) {
  const videoContainer = document.getElementById('video-container');
  const video = videoContainer.querySelector('video');
  
  // 停止当前播放并更换源
  video.pause();
  video.src = src;
  video.load(); // 重新加载视频
  
  // 添加错误处理
  video.onerror = function() {
    console.error('视频加载失败，请检查路径或格式:', src);
    alert('视频无法播放，请确认文件是否存在');
    resumeBackgroundMusic(); // 恢复音乐
  };
  
  // 暂停背景音乐
  pauseBackgroundMusic();
  
  // 加载并播放
  video.oncanplay = () => {
    videoContainer.style.opacity = 1;
    videoContainer.style.pointerEvents = 'auto'; // 允许交互
    video.play().catch(err => {
      console.error('视频播放失败:', err);
      alert('请点击视频开始播放');
    });
    
    // 仅在视频结束时隐藏
    video.onended = () => {
      hideVideo();
    };
  };
}

// 隐藏视频并恢复音乐
function hideVideo() {
  const videoContainer = document.getElementById('video-container');
  const video = videoContainer.querySelector('video');
  videoContainer.style.opacity = 0;
  videoContainer.style.pointerEvents = 'none';
  video.pause();
  resumeBackgroundMusic(); // 恢复背景音乐
}

// 隐藏所有媒体元素
function hideAllMedia() {
  document.getElementById('special-text').style.opacity = 0;
  document.getElementById('photo-container').style.opacity = 0;
  
  const videoContainer = document.getElementById('video-container');
  const video = videoContainer.querySelector('video');
  videoContainer.style.opacity = 0;
  videoContainer.style.pointerEvents = 'none';
  video.pause();
  resumeBackgroundMusic(); // 确保音乐恢复
}

// 星空动画
function animateStars() {
  requestAnimationFrame(animateStars);

  stars.forEach(star => {
    // 星星移动
    star.position.z += 0.02;
    if (star.position.z > 5) {
      star.position.z = -40;
      star.position.x = (Math.random() - 0.5) * 40;
      star.position.y = (Math.random() - 0.5) * 40;
    }

    // 星星旋转
    star.rotation.x += star.rotationSpeedX;
    star.rotation.y += star.rotationSpeedY;
  });

  // 同步隧道动画
  if (typeof animateTunnel === 'function') {
    animateTunnel();
  }

  renderer.render(scene, camera);
}

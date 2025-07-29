// 等待页面加载完成
window.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const enterBtn = document.getElementById('enter-btn');
    
    // 自动播放背景音乐
    setTimeout(() => {
        playBackgroundMusic();
    }, 1000);
    
    // 欢迎页面进入按钮点击事件
    enterBtn.addEventListener('click', () => {
        welcomeScreen.style.opacity = 0;
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            // 初始化宇宙场景（移除隧道初始化）
            initStars();
            initThemeSwitcher(); 
            startCountdown();
        }, 1000);
    });
});
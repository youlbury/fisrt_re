let audio;

function playBackgroundMusic() {
    if (!audio) {
        audio = new Audio('assets/sounds/bgm.mp3');
        audio.loop = true;
    }
    audio.play().catch(err => console.log('背景音乐播放失败:', err));
}

// 新增：暂停背景音乐
function pauseBackgroundMusic() {
    if (audio) audio.pause();
}

// 新增：恢复背景音乐
function resumeBackgroundMusic() {
    if (audio) audio.play().catch(err => console.log('恢复背景音乐失败:', err));
}
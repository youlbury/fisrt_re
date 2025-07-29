// 添加一个新的js文件 js/themeSwitcher.js
function initThemeSwitcher() {
    // 根据时间切换主题
    function updateThemeByTime() {
        const hour = new Date().getHours();
        const body = document.body;
        
        // 凌晨5点到17点：银河系主题
        if (hour >= 5 && hour < 17) {
            body.style.background = "var(--galaxy-gradient)";
        }
        // 17点到20点：黄昏星空
        else if (hour >= 17 && hour < 20) {
            body.style.background = "var(--twilight-gradient)";
        }
        // 其他时间：深夜星空
        else {
            body.style.background = "var(--starry-gradient)";
        }
    }
    
    // 初始设置一次
    updateThemeByTime();
    
    // 每小时检查一次时间并更新主题
    setInterval(updateThemeByTime, 3600000);
}
// js/countdown.js
function startCountdown() {
    // 设置开始日期为2024年4月7日（月份从0开始，4月对应3）
    const startDate = new Date(2024, 3, 8).getTime();

    function updateLoveDays() {
        const now = Date.now();
        const diff = now - startDate;
        
        // 计算相爱天数
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        // 更新DOM显示，确保在左上角显示
        document.getElementById('countdown').textContent =
            `我们已经相爱 ${days} 天了`;
    }
    
    // 立即更新一次
    updateLoveDays();
    // 每天（86400000毫秒）更新一次
    setInterval(updateLoveDays, 86400000);
}
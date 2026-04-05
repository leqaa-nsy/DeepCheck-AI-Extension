// دالة إظهار الأيقونة - خليتها في الأول عشان المتصفح يشوفها فوراً
function showFloatingIcon(x, y, url) {
    let icon = document.getElementById('deepcheck-ui-icon');
    if (!icon) {
        icon = document.createElement('div');
        icon.id = 'deepcheck-ui-icon';
        icon.className = 'deepcheck-icon';
        document.body.appendChild(icon);
    }
    
    icon.style.left = (x + 15) + 'px';
    icon.style.top = (y + 15) + 'px';
    icon.style.display = 'block';

    icon.onclick = (e) => {
        e.stopPropagation();
        scanImage(url);
    };
}

// مراقبة حركة الماوس
document.addEventListener('mouseover', (e) => {
    const target = e.target;
    const img = target.closest('img');
    const video = target.closest('ytd-thumbnail, ytd-reel-video-renderer, video');

    let imageUrl = "";
    if (img && img.src && img.src.startsWith('http')) {
        imageUrl = img.src;
    } else if (video) {
        const thumb = video.querySelector('img');
        if (thumb) imageUrl = thumb.src;
    }

    if (imageUrl) {
        // بننادي على نفس الاسم اللي فوق بالظبط
        showFloatingIcon(e.pageX, e.pageY, imageUrl);
    }
});

// إخفاء الأيقونة عند الابتعاد
document.addEventListener('mousemove', (e) => {
    const icon = document.getElementById('deepcheck-ui-icon');
    if (icon && !e.target.closest('img, ytd-thumbnail, video, #deepcheck-ui-icon')) {
        icon.style.display = 'none';
    }
});

// دالة الفحص
async function scanImage(imageUrl) {
    try {
        const response = await fetch('http://localhost:5000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: imageUrl })
        });
        const data = await response.json();
        alert(data.report || "فشل التحليل");
    } catch (err) {
        alert("تأكد من تشغيل app.py أولاً!");
    }
}
